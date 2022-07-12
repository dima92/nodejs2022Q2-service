import { Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { v4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  private db: InMemoryDB<Artist>;

  constructor() {
    this.db = new InMemoryDB<Artist>(Artist);
  }

  create(createArtistDto: CreateArtistDto) {
    const data = {
      id: v4(),
      ...createArtistDto,
    };

    return this.db.create(data);
  }

  findAll() {
    return this.db.findAll();
  }

  findOne(id: string) {
    return this.db.findOne(id);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);

    const data = {
      ...artist,
      ...updateArtistDto,
    };

    return this.db.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.remove(id);
  }
}
