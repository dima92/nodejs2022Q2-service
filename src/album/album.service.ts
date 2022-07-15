import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { v4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  private static db: InMemoryDB<Album>;

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {
    AlbumService.db = new InMemoryDB<Album>(Album);
  }

  async create(createAlbumDto: CreateAlbumDto) {
    const data = {
      id: v4(),
      ...createAlbumDto,
    };

    return AlbumService.db.create(data);
  }

  async findAll() {
    return AlbumService.db.findAll();
  }

  async findOne(id: string) {
    return AlbumService.db.findOne(id);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id);

    const data = {
      ...album,
      ...updateAlbumDto,
    };

    return AlbumService.db.update(id, data);
  }

  async remove(id: string) {
    const tracks = await this.trackService.findAll();

    for (const track of tracks) {
      if (track.albumId !== id) continue;

      await this.trackService.update(track.id, { ...track, albumId: null });
    }

    this.favoritesService.removeAlbumToFavourites(id);
    return AlbumService.db.remove(id);
  }
}
