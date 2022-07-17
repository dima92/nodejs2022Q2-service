import { Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private db: InMemoryDB<User>;

  constructor() {
    this.db = new InMemoryDB<User>(User);
  }

  async create(createUserDto: CreateUserDto) {
    const data = {
      id: v4(),
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return this.db.create(data);
  }

  findAll() {
    return this.db.findAll();
  }

  async findOne(id: string) {
    return this.db.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: User) {
    const data = {
      ...user,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    return this.db.update(id, data);
  }

  async remove(id: string) {
    return this.db.remove(id);
  }
}
