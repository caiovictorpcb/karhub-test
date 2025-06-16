import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeerModule } from '../beer/beer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyModule } from '../spotify/spotify.module';
import { ConfigModule } from '@nestjs/config';
import { mongooseConfig } from '../../config/mongoose.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BeerModule,
    MongooseModule.forRoot(mongooseConfig().url),
    SpotifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
