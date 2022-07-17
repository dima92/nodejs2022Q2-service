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
    artists: new Set(),
    albums: new Set(),
    tracks: new Set(),
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

    FavoritesService.db.artists.add(id);
    return { statusCode: 201, message: 'Added successfully' };
  }

  removeArtistToFavourites(id: string) {
    return FavoritesService.db.artists.delete(id);
  }

  async addAlbumToFavourites(id: string) {
    const album = await this.albumService.findOne(id);

    if (!album) throw new UnprocessableEntityException();

    FavoritesService.db.albums.add(id);
    return { statusCode: 201, message: 'Added successfully' };
  }

  removeAlbumToFavourites(id: string) {
    return FavoritesService.db.albums.delete(id);
  }

  async addTrackToFavourites(id: string) {
    const track = await this.trackService.findOne(id);

    if (!track) throw new UnprocessableEntityException();

    FavoritesService.db.tracks.add(id);
    return { statusCode: 201, message: 'Added successfully' };
  }

  removeTrackToFavourites(id: string) {
    return FavoritesService.db.tracks.delete(id);
  }

  async findAll() {
    return {
      artists: await Promise.all(
        Array.from(FavoritesService.db.artists).map((artistId) =>
          this.artistService.findOne(artistId),
        ),
      ),
      albums: await Promise.all(
        Array.from(FavoritesService.db.albums).map((albumId) =>
          this.albumService.findOne(albumId),
        ),
      ),
      tracks: await Promise.all(
        Array.from(FavoritesService.db.tracks).map((trackId) =>
          this.trackService.findOne(trackId),
        ),
      ),
    };
  }
}
