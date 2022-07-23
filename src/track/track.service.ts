import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { v4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackService {
  private static db: InMemoryDB<Track>;

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    private prisma: PrismaService,
  ) {
    TrackService.db = new InMemoryDB<Track>(Track);
  }

  async create(createTrackDto: CreateTrackDto) {
    return this.prisma.track.create({ data: createTrackDto });
  }

  async findAll() {
    return this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findFirst({ where: { id } });

    if (!track)
      throw new NotFoundException({
        statusCode: 404,
        message: `Track with this ID was not found`,
        error: 'Not Found',
      });

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    return this.prisma.track.update({
      where: { id },
      data: { ...updateTrackDto },
    });
  }

  async remove(id: string) {
    this.favoritesService.removeTrackToFavourites(id);
    return this.prisma.track.delete({ where: { id } });
  }
}
