import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';
import { Beer, BeerDocument } from './schema/beer.schema';
import { SpotifyService } from '../spotify/spotify.service';

@Injectable()
export class BeerService {
  constructor(
    @InjectModel(Beer.name) private beerModel: Model<Beer>,
    private spotifyService: SpotifyService,
  ) {}

  create(createBeerDto: CreateBeerDto) {
    if (!createBeerDto.maxTemperature || !createBeerDto.minTemperature) {
      throw new BadRequestException('Max and Min temperatures are required');
    }
    const averageTemperature =
      (createBeerDto.maxTemperature + createBeerDto.minTemperature) / 2;
    return this.beerModel.create({
      ...createBeerDto,
      averageTemperature,
    });
  }

  async findRecommendation(temp: number): Promise<{
    beerStyle: string;
    playlist: {
      name: string;
      tracks: { name: string; artist: string; link: string }[];
    };
  }> {
    const closestBeer = (await this.beerModel
      .aggregate([
        {
          $addFields: {
            tempDiff: { $abs: { $subtract: ['$averageTemperature', temp] } },
          },
        },
        { $sort: { tempDiff: 1, name: 1 } },
        { $limit: 1 },
      ])
      .exec()) as BeerDocument[];

    if (!closestBeer.length) {
      throw new NotFoundException('No beer styles found');
    }

    const beerStyle = closestBeer[0].beerStyle;

    const playlist =
      await this.spotifyService.getPlaylistByBeerStyle(beerStyle);

    if (!playlist) {
      throw new NotFoundException('No playlist found for this beer style');
    }

    const playlistId = playlist.id;

    const tracks = await this.spotifyService.getPlaylistTracks(playlistId);

    return {
      beerStyle,
      playlist: {
        name: playlist.name,
        tracks: tracks.map((track) => ({
          name: track.name,
          artist: track.artists[0]?.name ?? 'Unknown Artist',
          link: track.external_urls.spotify,
        })),
      },
    };
  }

  findAll() {
    return this.beerModel.find().exec();
  }

  async update(beerStyle: string, updateBeerDto: UpdateBeerDto) {
    const beer = await this.beerModel.findOne({ beerStyle }).exec();
    if (!beer) {
      throw new NotFoundException(`Beer style ${beerStyle} not found`);
    }
    const maxTemperature =
      updateBeerDto?.maxTemperature ?? beer?.maxTemperature;
    const minTemperature =
      updateBeerDto?.minTemperature ?? beer?.minTemperature;
    const averageTemperature = (maxTemperature + minTemperature) / 2;
    return this.beerModel.updateOne(
      { beerStyle: beerStyle },
      { $set: { maxTemperature, minTemperature, averageTemperature } },
      { runValidators: true, new: true },
    );
  }

  async delete(beerStyle: string) {
    await this.beerModel.updateOne({ beerStyle }, { deleted: true }).exec();
    return { message: 'Beer deleted successfully' };
  }
}
