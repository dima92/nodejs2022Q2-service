import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    ArtistService,
    AlbumService,
    TrackService,
    PrismaService,
  ],
})
export class FavoritesModule {}
