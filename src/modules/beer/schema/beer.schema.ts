import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BeerDocument = HydratedDocument<Beer>;

@Schema({
  collection: 'beers',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Beer {
  @Prop({ required: true })
  beerStyle: string;

  @Prop({ required: true })
  minTemperature: number;

  @Prop({ required: true })
  maxTemperature: number;

  @Prop({ required: true })
  averageTemperature: number;

  @Prop({ required: true, default: false, type: Boolean })
  deleted: boolean;
}

export const BeerSchema = SchemaFactory.createForClass(Beer);

BeerSchema.pre('findOne', function () {
  this.where({ deleted: false });
});

BeerSchema.pre('updateOne', function () {
  this.where({ deleted: false });
});

BeerSchema.pre('find', function () {
  this.where({ deleted: false });
});
