import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { v4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  private static db: InMemoryDB<Track>;

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
  ) {
    TrackService.db = new InMemoryDB<Track>(Track);
  }

  async create(createTrackDto: CreateTrackDto) {
    createTrackDto.artistId &&
      (await this.artistService.findOne(createTrackDto.artistId));

    createTrackDto.albumId &&
      (await this.albumService.findOne(createTrackDto.albumId));

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
    updateTrackDto.artistId &&
      (await this.artistService.findOne(updateTrackDto.artistId));

    updateTrackDto.albumId &&
      (await this.albumService.findOne(updateTrackDto.albumId));

    const artist = await this.findOne(id);

    const data = {
      ...artist,
      ...updateTrackDto,
    };

    return TrackService.db.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return TrackService.db.remove(id);
  }
}
