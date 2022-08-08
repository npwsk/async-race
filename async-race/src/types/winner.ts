import Car from './car';

interface Winner {
  id: number;
  wins: number;
  time: number;
}

interface WinnerExtended extends Winner, Car {}

export { Winner, WinnerExtended };
