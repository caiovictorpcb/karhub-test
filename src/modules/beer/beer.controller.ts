import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BeerService } from './beer.service';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';

@Controller('beer')
export class BeerController {
  constructor(private readonly beerService: BeerService) {}

  @Post()
  create(@Body() createBeerDto: CreateBeerDto) {
    return this.beerService.create(createBeerDto);
  }

  @Get()
  findAll() {
    return this.beerService.findAll();
  }

  @Post('recommend')
  async findRecommendation(@Body() body: { temperature: number }) {
    return this.beerService.findRecommendation(body.temperature);
  }

  @Patch(':beerStyle')
  update(
    @Param('beerStyle') beerStyle: string,
    @Body() updateBeerDto: UpdateBeerDto,
  ) {
    return this.beerService.update(beerStyle, updateBeerDto);
  }

  @Delete(':beerStyle')
  delete(@Param('beerStyle') beerStyle: string) {
    return this.beerService.delete(beerStyle);
  }
}
