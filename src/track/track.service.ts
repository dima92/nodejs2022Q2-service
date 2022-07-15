import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { v4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  private static db: InMemoryDB<Track>;

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {
    TrackService.db = new InMemoryDB<Track>(Track);
  }

  async create(createTrackDto: CreateTrackDto) {
    const data = {
      id: v4(),
      ...createTrackDto,
    };

    return TrackService.db.create(data);
  }

  async findAll() {
    return TrackService.db.findAll();
  }

  async findOne(id: string) {
    return TrackService.db.findOne(id);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);

    const data = {
      ...track,
      ...updateTrackDto,
    };

    return TrackService.db.update(id, data);
  }

  async remove(id: string) {
    this.favoritesService.removeTrackToFavourites(id);
    return TrackService.db.remove(id);
  }
}
