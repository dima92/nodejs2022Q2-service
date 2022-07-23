import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isNull } from 'lodash';
import { InMemoryDB } from 'src/db/InMemoryDB';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from '../prisma/prisma.service';

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
    private prisma: PrismaService,
  ) {
    AlbumService.db = new InMemoryDB<Album>(Album);
  }

  async create(createAlbumDto: CreateAlbumDto) {
    isNull(createAlbumDto.artistId) && delete createAlbumDto.artistId;
    return this.prisma.album.create({
      data: {
        ...createAlbumDto,
      },
    });
  }

  async findAll() {
    return this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findFirst({ where: { id } });

    if (!album)
      throw new NotFoundException({
        statusCode: 404,
        message: `Album with this ID was not found`,
        error: 'Not Found',
      });

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return this.prisma.album.update({
      where: { id },
      data: { ...updateAlbumDto },
    });
  }

  async remove(id: string) {
    const tracks = await this.trackService.findAll();

    for (const track of tracks) {
      if (track.albumId !== id) continue;

      await this.trackService.update(track.id, { ...track, albumId: null });
    }

    this.favoritesService.removeAlbumToFavourites(id);
    return this.prisma.album.delete({ where: { id } });
  }
}
