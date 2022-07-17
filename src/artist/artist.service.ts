import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from '../album/album.service';
import { InMemoryDB } from '../db/InMemoryDB';
import { FavoritesService } from '../favorites/favorites.service';
import { TrackService } from '../track/track.service';
import { v4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  private static db: InMemoryDB<Artist>;

  constructor(
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
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

  async findOne(id: string) {
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
    const albums = await this.albumService.findAll();
    const tracks = await this.trackService.findAll();

    for (const album of albums) {
      if (album.artistId !== id) continue;

      await this.albumService.update(album.id, { ...album, artistId: null });
    }

    for (const track of tracks) {
      if (track.artistId !== id) continue;

      await this.trackService.update(track.id, { ...track, artistId: null });
    }

    this.favoritesService.removeArtistToFavourites(id);
    return ArtistService.db.remove(id);
  }
}
