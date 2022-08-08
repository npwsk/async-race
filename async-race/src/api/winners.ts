import { Winner } from '../types/winner';
import API_URL from '../config';

type SortParam = 'id' | 'wins' | 'time';
type SortOrder = 'ASC' | 'DESC';

type GetWinnersParams = {
  page?: number;
  limit?: number;
  sort?: SortParam;
  order?: SortOrder;
};

const getUrl = (id?: number): URL => {
  const url = new URL('/winners', API_URL);
  if (id !== undefined) {
    url.pathname = `${url.pathname}/${id}`;
  }
  return url;
};

const getWinners = async (
  params: GetWinnersParams = {},
): Promise<{ winners: Winner[]; total: number }> => {
  const url = getUrl();

  Object.entries(params).forEach(([param, value]) => {
    url.searchParams.set(`_${param}`, value.toString());
  });

  const response = await fetch(url);

  if (response.ok) {
    const winners: Winner[] = await response.json();
    const totalCount = response.headers.get('X-Total-Count');
    const total = totalCount === null ? winners.length : Number(totalCount);
    return { winners, total };
  }
  throw new Error(`error: ${response.status}`);
};

const getWinner = async (id: number): Promise<Winner> => {
  const url = getUrl(id);

  const response = await fetch(url);

  if (response.ok) {
    const data: Winner = await response.json();
    return data;
  }
  throw new Error(`error: ${response.status}`);
};

const createWinner = async (id: number, wins: number, time: number): Promise<Winner> => {
  const url = getUrl();

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify({ id, wins, time });

  const requestOptions = {
    method: 'POST',
    headers,
    body,
  };

  const response = await fetch(url, requestOptions);

  if (response.ok) {
    const data: Winner = await response.json();
    return data;
  }
  throw new Error(`error: ${response.status}`);
};

const deleteWinner = async (id: number): Promise<void> => {
  const url = getUrl(id);

  const requestOptions = {
    method: 'DELETE',
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`error: ${response.status}`);
  }
};

const updateWinner = async (id: number, wins: number, time: number): Promise<Winner> => {
  const url = getUrl(id);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify({ wins, time });

  const requestOptions = {
    method: 'PUT',
    headers,
    body,
  };

  const response = await fetch(url, requestOptions);

  if (response.ok) {
    const data: Winner = await response.json();
    return data;
  }
  throw new Error(`error: ${response.status}`);
};

export {
  getWinners, getWinner, createWinner, deleteWinner, updateWinner,
};
