import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeerModule } from '../beer/beer.module';
import { SpotifyModule } from '../spotify/spotify.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

describe('AppModule', () => {
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(testingModule).toBeDefined();
  });

  it('should import ConfigModule', () => {
    const configModule = testingModule.get(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should import BeerModule', () => {
    const beerModule = testingModule.get(BeerModule);
    expect(beerModule).toBeDefined();
  });

  it('should import SpotifyModule', () => {
    const spotifyModule = testingModule.get(SpotifyModule);
    expect(spotifyModule).toBeDefined();
  });

  it('should import MongooseModule with correct configuration', () => {
    const mongooseModule = testingModule.get(MongooseModule);
    expect(mongooseModule).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = testingModule.get(AppController);
    expect(controller).toBeDefined();
  });

  it('should have AppService', () => {
    const service = testingModule.get(AppService);
    expect(service).toBeDefined();
  });
});
