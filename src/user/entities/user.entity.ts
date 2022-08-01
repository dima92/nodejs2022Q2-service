import { Exclude, Transform } from 'class-transformer';

export class User {
  id: string;

  login: string;

  @Exclude()
  password: string;

  version: number;

  @Transform(({ value }) => new Date(value).getTime())
  createdAt: Date;

  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
