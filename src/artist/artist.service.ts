import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { v4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { AlbumService } from '../album/album.service';

@Injectable()
export class ArtistService {
  private static db: InMemoryDB<Artist>;

  constructor(
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
  ) {
    ArtistService.db = new InMemoryDB<Artist>(Artist);
  }

  create(createArtistDto: CreateArtistDto) {
    const data = {
      id: v4(),
      ...createArtistDto,
    };

    return ArtistService.db.create(data);
  }

  findAll() {
    return ArtistService.db.findAll();
  }

  findOne(id: string) {
    return ArtistService.db.findOne(id);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);

    const data = {
      ...artist,
      ...updateArtistDto,
    };

    return ArtistService.db.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    const albums = await this.albumService.findAll();

    for (const album of albums) {
      if (album.artistId !== id) continue;

      await this.albumService.update(album.id, { ...album, artistId: null });
    }

    return ArtistService.db.remove(id);
  }
}
