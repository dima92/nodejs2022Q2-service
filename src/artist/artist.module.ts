import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ArtistController],
  providers: [
    ArtistService,
    AlbumService,
    TrackService,
    FavoritesService,
    PrismaService,
  ],
})
export class ArtistModule {}
