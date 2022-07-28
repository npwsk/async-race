import Winner from '../types/winner';
import API_URL from '../config';

const getAllWinners = async (): Promise<Winner[]> => {
  const data: Winner[] = await fetch(new URL('/winners', API_URL)).then((res) => res.json());
  return data;
};

export default getAllWinners;
