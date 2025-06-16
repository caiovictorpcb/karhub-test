import { Test, TestingModule } from '@nestjs/testing';
import { BeerController } from './beer.controller';
import { BeerService } from './beer.service';
import { CreateBeerDto } from './dto/create-beer.dto';
import { UpdateBeerDto } from './dto/update-beer.dto';

describe('BeerController', () => {
  let controller: BeerController;
  let service: BeerService;

  const mockBeerService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findRecommendation: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeerController],
      providers: [
        {
          provide: BeerService,
          useValue: mockBeerService,
        },
      ],
    }).compile();

    controller = module.get<BeerController>(BeerController);
    service = module.get<BeerService>(BeerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new beer', async () => {
      const createBeerDto: CreateBeerDto = {
        beerStyle: 'IPA',
        minTemperature: -2,
        maxTemperature: 4,
      };
      const result = { _id: '1', ...createBeerDto };

      mockBeerService.create.mockReturnValue(result);

      expect(await controller.create(createBeerDto)).toEqual(result);
      expect(mockBeerService.create).toHaveBeenCalledWith(createBeerDto);
    });
  });

  describe('findAll', () => {
    it('should return all beers', async () => {
      const result = [
        { _id: '1', beerStyle: 'IPA', minTemperature: -2, maxTemperature: 4 },
      ];

      mockBeerService.findAll.mockReturnValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockBeerService.findAll).toHaveBeenCalled();
    });
  });

  describe('recommend', () => {
    it('should return beer recommendation based on temperature', async () => {
      const body = { temperature: 0 };
      const result = {
        beerStyle: 'IPA',
        minTemperature: -2,
        maxTemperature: 4,
      };

      mockBeerService.findRecommendation.mockResolvedValue(result);

      expect(await controller.findRecommendation(body)).toEqual(result);
      expect(mockBeerService.findRecommendation).toHaveBeenCalledWith(
        body.temperature,
      );
    });
  });

  describe('update', () => {
    it('should update a beer', async () => {
      const beerStyle = 'IPA';
      const updateBeerDto: UpdateBeerDto = { minTemperature: -3 };
      const result = {
        _id: '1',
        beerStyle,
        minTemperature: -3,
        maxTemperature: 4,
      };

      mockBeerService.update.mockReturnValue(result);

      expect(await controller.update(beerStyle, updateBeerDto)).toEqual(result);
      expect(mockBeerService.update).toHaveBeenCalledWith(
        beerStyle,
        updateBeerDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a beer', async () => {
      const beerStyle = 'IPA';
      const result = { message: 'Beer deleted successfully' };

      mockBeerService.delete.mockReturnValue(result);

      expect(await controller.delete(beerStyle)).toEqual(result);
      expect(mockBeerService.delete).toHaveBeenCalledWith(beerStyle);
    });
  });
});
