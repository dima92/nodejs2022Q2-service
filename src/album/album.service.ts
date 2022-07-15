import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { v4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class AlbumService {
  private static db: InMemoryDB<Album>;

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
  ) {
    AlbumService.db = new InMemoryDB<Album>(Album);
  }

  async create(createAlbumDto: CreateAlbumDto) {
    createAlbumDto.artistId &&
      (await this.artistService.findOne(createAlbumDto.artistId));
    const data = {
      id: v4(),
      artistId: createAlbumDto.artistId ? createAlbumDto.artistId : null,
      ...createAlbumDto,
    };

    return AlbumService.db.create(data);
  }

  async findAll() {
    return AlbumService.db.findAll();
  }

  findOne(id: string) {
    return AlbumService.db.findOne(id);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    updateAlbumDto.artistId &&
      (await this.artistService.findOne(updateAlbumDto.artistId));
    const album = await this.findOne(id);

    const data = {
      ...album,
      ...updateAlbumDto,
    };

    return AlbumService.db.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return AlbumService.db.remove(id);
  }
}
