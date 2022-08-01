import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });

    return new User(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((item) => new User(item));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();

    return new User(user);
  }

  async findByLogin(login: string) {
    const user = await this.prisma.user.findFirst({ where: { login } });
    if (!user) throw new NotFoundException();

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const oldUser = await this.prisma.user.findUnique({ where: { id } });

    if (oldUser) {
      const match = await bcrypt.compare(
        updateUserDto.oldPassword,
        oldUser.password,
      );

      if (!match) {
        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          message: 'Wrong credentials',
        });
      }
    }

    const newUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: await bcrypt.hash(updateUserDto.newPassword, 10),
        version: { increment: 1 },
      },
    });

    return new User(newUser);
  }

  async remove(id: string) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async setRefreshToken(id: string, token: string) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        refreshToken: await bcrypt.hash(token, 10),
      },
    });
  }
}
