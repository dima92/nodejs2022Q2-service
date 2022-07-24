import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('artist/:id')
  @HttpCode(201)
  addArtistToFavourites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService.addArtistToFavourites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtistToFavourites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService.removeArtistToFavourites(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbumToFavourites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService.addAlbumToFavourites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbumToFavourites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService.removeAlbumToFavourites(id);
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrackToFavourites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService.addTrackToFavourites(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrackToFavourites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService.removeTrackToFavourites(id);
  }

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }
}
