import API_URL from '../config';
import Engine from '../types/engine';

const getUrl = (): URL => new URL('/engine', API_URL);

const changeEngineStatus = async (id: number, status: string): Promise<Response> => {
  const url = getUrl();
  url.searchParams.set('id', id.toString());
  url.searchParams.set('status', status);

  const requestOptions = {
    method: 'PATCH',
  };

  const response = await fetch(url, requestOptions);

  return response;
};

const startCarEngine = async (id: number): Promise<Engine> => {
  const status = 'started';
  const response = await changeEngineStatus(id, status);

  if (response.ok) {
    const data: Engine = await response.json();
    return data;
  }

  const error = await response.text();
  throw new Error(`error: ${error}`);
};

const stopCarEngine = async (id: number): Promise<Engine> => {
  const status = 'stopped';
  const response = await changeEngineStatus(id, status);

  if (response.ok) {
    const data: Engine = await response.json();
    return data;
  }

  const error = await response.text();
  throw new Error(`error: ${error}`);
};

const driveCar = async (id: number): Promise<void> => {
  const status = 'drive';
  const response = await changeEngineStatus(id, status);

  const data: { status: boolean } = await response.json();

  if (!data.status) {
    const error = await response.text();
    throw new Error(`error: ${error}`);
  }
};

export { startCarEngine, stopCarEngine, driveCar };
