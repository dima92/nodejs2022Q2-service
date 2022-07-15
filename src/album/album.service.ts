import { Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { v4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  private db: InMemoryDB<Album>;

  constructor() {
    this.db = new InMemoryDB<Album>(Album);
  }

  create(createAlbumDto: CreateAlbumDto) {
    const data = {
      id: v4(),
      ...createAlbumDto,
    };

    return this.db.create(data);
  }

  async findAll() {
    return this.db.findAll();
  }

  findOne(id: string) {
    return this.db.findOne(id);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id);

    const data = {
      ...album,
      ...updateAlbumDto,
    };

    return this.db.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.remove(id);
  }
}
