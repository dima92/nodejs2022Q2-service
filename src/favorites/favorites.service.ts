import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  private static db: Favorite = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  async addArtistToFavourites(id: string) {
    const artist = await this.artistService.findOne(id);

    if (!artist) throw new UnprocessableEntityException();

    return FavoritesService.db.artists.push(id);
  }

  removeArtistToFavourites(id: string) {
    const idx = FavoritesService.db.artists.findIndex(
      (artistId) => artistId === id,
    );

    return idx !== -1 && FavoritesService.db.artists.splice(idx, 1);
  }

  async addAlbumToFavourites(id: string) {
    const album = await this.albumService.findOne(id);

    if (!album) throw new UnprocessableEntityException();

    return FavoritesService.db.albums.push(id);
  }

  removeAlbumToFavourites(id: string) {
    const idx = FavoritesService.db.albums.findIndex(
      (albumId) => albumId === id,
    );

    return idx !== -1 && FavoritesService.db.albums.splice(idx, 1);
  }

  async addTrackToFavourites(id: string) {
    const track = await this.trackService.findOne(id);

    if (!track) throw new UnprocessableEntityException();

    return FavoritesService.db.tracks.push(id);
  }

  removeTrackToFavourites(id: string) {
    const idx = FavoritesService.db.tracks.findIndex(
      (trackId) => trackId === id,
    );

    return idx !== -1 && FavoritesService.db.tracks.splice(idx, 1);
  }

  async findAll() {
    return {
      artists: await Promise.all(
        FavoritesService.db.artists.map(async (artistId) =>
          this.artistService.findOne(artistId),
        ),
      ),
      albums: await Promise.all(
        FavoritesService.db.albums.map(async (albumId) =>
          this.albumService.findOne(albumId),
        ),
      ),
      tracks: await Promise.all(
        FavoritesService.db.tracks.map(async (trackId) =>
          this.trackService.findOne(trackId),
        ),
      ),
    };
  }
}
