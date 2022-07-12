import { NotFoundException } from '@nestjs/common';

interface InMemoryDBEntity {
  id?: string;
}

export class InMemoryDB<T extends InMemoryDBEntity> {
  private db: T[] = [];
  private entity: new (data: T) => T;

  constructor(entity: { new (data: T): T }) {
    this.entity = entity;
  }

  async create(data: T): Promise<T> {
    return new Promise((resolver) => {
      const newData = new this.entity(data);
      this.db.push(newData);

      resolver(newData);
    });
  }

  async findAll(): Promise<T[]> {
    return new Promise((resolver) => {
      resolver(this.db.map((data: T) => data));
    });
  }

  async findOne(id: string): Promise<T> {
    return new Promise(async (resolver, reject) => {
      const foundData = this.db.find((data: T) => data.id === id);

      if (!foundData) reject(new NotFoundException());

      resolver(foundData);
    });
  }

  async update(id: string, rawData: T): Promise<T> {
    return new Promise(async (resolver) => {
      const newData = new this.entity(rawData);
      this.db = this.db.map((data: T) => (data.id === id ? newData : data));

      resolver(newData);
    });
  }

  async remove(id: string): Promise<true> {
    return new Promise(async (resolver) => {
      this.db = this.db.filter((data: T) => data.id !== id);
      resolver(true);
    });
  }
}
