import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return plainToInstance(User, user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => plainToInstance(User, user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user)
      throw new NotFoundException({
        statusCode: 404,
        message: `User with this ID was not found`,
        error: 'Not Found',
      });

    return plainToInstance(User, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (updateUserDto.oldPassword !== user.password)
      throw new ForbiddenException({
        statusCode: 403,
        message: 'The wrong password was entered',
        error: 'Forbidden',
      });

    return plainToInstance(
      User,
      await this.prisma.user.update({
        where: { id },
        data: {
          password: updateUserDto.newPassword,
          version: { increment: 1 },
        },
      }),
    );
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
