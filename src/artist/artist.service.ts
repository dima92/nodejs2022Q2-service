import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from '../favorites/favorites.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    private prisma: PrismaService,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    return this.prisma.artist.create({ data: createArtistDto });
  }

  findAll() {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findFirst({ where: { id } });

    if (!artist)
      throw new NotFoundException({
        statusCode: 404,
        message: `Artist with this ID was not found`,
        error: 'Not Found',
      });

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    return this.prisma.artist.update({
      where: { id },
      data: { ...updateArtistDto },
    });
  }

  async remove(id: string) {
    this.favoritesService.removeArtistToFavourites(id);
    return this.prisma.artist.delete({ where: { id } });
  }
}
