import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeerController } from './beer.controller';
import { BeerService } from './beer.service';
import { Beer, BeerSchema } from './schema/beer.schema';
import { SpotifyModule } from '../spotify/spotify.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Beer.name, schema: BeerSchema }]),
    SpotifyModule,
  ],
  controllers: [BeerController],
  providers: [BeerService],
})
export class BeerModule {}
