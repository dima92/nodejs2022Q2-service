import { Exclude, Transform } from 'class-transformer';

export class User {
  id: string;

  login: string;

  @Exclude({ toPlainOnly: true })
  password: string;

  version: number;

  @Transform(({ value }) => new Date(value).getTime())
  createdAt: Date;

  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  refreshToken?: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
