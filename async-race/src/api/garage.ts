import Car from '../types/car';
import API_URL from '../config';

const getAllCars = async (): Promise<Car[]> => {
  const data: Car[] = await fetch(new URL('/garage', API_URL)).then((res) => res.json());
  return data;
};

export default getAllCars;
