import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumService } from '../album/album.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, AlbumService],
})
export class ArtistModule {}
