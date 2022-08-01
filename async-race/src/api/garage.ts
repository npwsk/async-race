import Car from '../types/car';
import API_URL from '../config';

type GetCarsParams = {
  page?: number;
  limit?: number;
};

const getUrl = (id?: number): URL => {
  const url = new URL('/garage', API_URL);
  if (id !== undefined) {
    url.pathname = `${url.pathname}/${id}`;
  }
  return url;
};

const getCars = async (params: GetCarsParams = {}): Promise<Car[]> => {
  const url = getUrl();

  Object.entries(params).forEach(([param, value]) => {
    url.searchParams.set(`_${param}`, value.toString());
  });

  const response = await fetch(url);

  if (response.ok) {
    const data: Car[] = await response.json();
    return data;
  }

  throw new Error(`error: ${response.status}`);
};

const getTotalCars = async (): Promise<number> => {
  const response = await fetch(getUrl());

  if (response.ok) {
    const data: Car[] = await response.json();
    return data.length;
  }

  throw new Error(`error: ${response.status}`);
};

const getCar = async (id: number): Promise<Car> => {
  const url = getUrl(id);
  const response = await fetch(url);

  if (response.ok) {
    const data: Car = await response.json();
    return data;
  }

  throw new Error(`error: ${response.status}`);
};

const createCar = async (name: string, color: string): Promise<Car> => {
  const url = getUrl();

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify({ name, color });

  const requestOptions = {
    method: 'POST',
    headers,
    body,
  };

  const response = await fetch(url, requestOptions);

  if (response.ok) {
    const data: Car = await response.json();
    return data;
  }

  throw new Error(`error: ${response.status}`);
};

const deleteCar = async (id: number): Promise<void> => {
  const url = getUrl(id);

  const requestOptions = {
    method: 'DELETE',
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`error: ${response.status}`);
  }
};

const updateCar = async (id: number, name: string, color: string): Promise<Car> => {
  const url = getUrl(id);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify({ name, color });

  const requestOptions = {
    method: 'PUT',
    headers,
    body,
  };

  const response = await fetch(url, requestOptions);

  if (response.ok) {
    const data: Car = await response.json();
    return data;
  }

  throw new Error(`error: ${response.status}`);
};

export {
  getCars, getTotalCars, getCar, createCar, deleteCar, updateCar,
};
