import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addArtistToFavourites(id: string) {
    const artist = await this.prisma.artist.findFirst({ where: { id } });
    if (!artist) throw new UnprocessableEntityException();

    const favs = await this.prisma.favorite.findMany();

    if (!favs.length) {
      const createdFavs = await this.prisma.favorite.create({ data: {} });
      await this.prisma.artist.update({
        where: { id },
        data: { favoriteId: createdFavs.id },
      });
    } else {
      await this.prisma.artist.update({
        where: { id },
        data: { favoriteId: favs[0].id },
      });
    }

    return { statusCode: 201, message: 'Added successfully' };
  }

  removeArtistToFavourites(id: string) {
    return this.prisma.artist.update({
      where: { id },
      data: { favoriteId: { set: null } },
    });
  }

  async addAlbumToFavourites(id: string) {
    const album = await this.prisma.album.findFirst({ where: { id } });
    if (!album) throw new UnprocessableEntityException();

    const favs = await this.prisma.favorite.findMany();

    if (!favs.length) {
      const createdFavs = await this.prisma.favorite.create({ data: {} });
      await this.prisma.album.update({
        where: { id },
        data: { favoriteId: createdFavs.id },
      });
    } else {
      await this.prisma.album.update({
        where: { id },
        data: { favoriteId: favs[0].id },
      });
    }

    return { statusCode: 201, message: 'Added successfully' };
  }

  removeAlbumToFavourites(id: string) {
    return this.prisma.album.update({
      where: { id },
      data: { favoriteId: { set: null } },
    });
  }

  async addTrackToFavourites(id: string) {
    const track = await this.prisma.track.findFirst({ where: { id } });
    if (!track) throw new UnprocessableEntityException();

    const favs = await this.prisma.favorite.findMany();

    if (!favs.length) {
      const createdFavs = await this.prisma.favorite.create({ data: {} });
      await this.prisma.track.update({
        where: { id },
        data: { favoriteId: createdFavs.id },
      });
    } else {
      await this.prisma.track.update({
        where: { id },
        data: { favoriteId: favs[0].id },
      });
    }

    return { statusCode: 201, message: 'Added successfully' };
  }

  removeTrackToFavourites(id: string) {
    return this.prisma.track.update({
      where: { id },
      data: { favoriteId: { set: null } },
    });
  }

  async findAll() {
    const favs = await this.prisma.favorite.findMany({
      select: {
        artists: { select: { id: true, name: true, grammy: true } },
        albums: {
          select: { id: true, name: true, year: true, artistId: true },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            artistId: true,
            albumId: true,
          },
        },
      },
    });

    return {
      artists: favs.length && favs[0].artists ? favs[0].artists : [],
      albums: favs.length && favs[0].albums ? favs[0].albums : [],
      tracks: favs.length && favs[0].tracks ? favs[0].tracks : [],
    };
  }
}
