import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, AlbumService, TrackService],
})
export class ArtistModule {}
