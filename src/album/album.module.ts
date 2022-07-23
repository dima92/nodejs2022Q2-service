import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AlbumController],
  providers: [
    AlbumService,
    ArtistService,
    TrackService,
    FavoritesService,
    PrismaService,
  ],
})
export class AlbumModule {}
