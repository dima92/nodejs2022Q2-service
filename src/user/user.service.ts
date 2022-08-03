import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 } from 'uuid';
import { InfoForUser, notFound } from '../utils/constants';

const dataWithoutPass = {
  password: false,
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  login: true,
};

@Injectable()
export class UserService {
  data: string;

  constructor(private prisma: PrismaService) {
    this.data = 'user';
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        id: v4(),
        version: 1,
      },
      select: dataWithoutPass,
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: dataWithoutPass,
    });
  }

  async findOne(id: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id },
        select: dataWithoutPass,
      });
    } catch (e) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let oldData;
    try {
      oldData = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
    } catch {
      throw new NotFoundException(notFound(this.data));
    }

    if (oldData.password !== updateUserDto.oldPassword)
      throw new ForbiddenException(InfoForUser.OLD_PASSWORD_WRONG);

    if (oldData.password === updateUserDto.newPassword)
      throw new ForbiddenException(InfoForUser.OLD_PASSWORD_WRONG);

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: updateUserDto.newPassword,
        version: { increment: 1 },
        updatedAt: Date.now(),
      },
      select: dataWithoutPass,
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: dataWithoutPass,
      });
    } catch (e) {
      throw new NotFoundException(notFound(this.data));
    }
  }
}
