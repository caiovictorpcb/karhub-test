export interface IMongooseConfig {
  url: string;
}

export const mongooseConfig = () => {
  const url = process.env.MONGODB_URL || 'mongodb://localhost/nest';
  console.log(url);
  return <IMongooseConfig>{
    url,
  };
};
