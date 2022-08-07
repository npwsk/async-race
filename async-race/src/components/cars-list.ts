import Car from '../types/car';
import Alert from './alert';
import CarView from './car-view';

type Callback<T> = (id: number) => T;

type CarListProps = {
  cars: Car[] | null;
  onDelete: Callback<void>;
  onSelect: Callback<void>;
};

export type RaceResult =
  | {
    hasWinners: true;
    winner: RaceWinner;
  }
  | { hasWinners: false };

type RaceWinner = {
  id: number;
  time: number;
};

class CarsList {
  container: HTMLElement;

  private alert: Alert;

  private carViews: CarView[];

  private onDelete: Callback<void>;

  private onSelect: Callback<void>;

  constructor({ cars, onDelete, onSelect }: CarListProps) {
    this.container = document.createElement('div');
    this.container.classList.add('vstack', 'border', 'm-3');
    this.carViews = cars?.map(
      (car) => new CarView({
        car,
        onDelete,
        onSelect,
      }),
    ) ?? [];
    this.onDelete = onDelete;
    this.onSelect = onSelect;
    this.alert = new Alert();
  }

  update(cars: Car[]): HTMLElement {
    if (cars === null) {
      const spinner = document.createElement('div');
      spinner.classList.add('spinner-border');
      this.container.replaceChildren(spinner);
      return this.container;
    }
    this.carViews = cars.map(
      (car) => new CarView({
        car,
        onDelete: this.onDelete,
        onSelect: this.onSelect,
      }),
    );
    this.container.replaceChildren(...this.carViews.map((view) => view.render()));

    const alert = this.alert.render();
    this.container.append(alert);

    return this.container;
  }

  setSelected(id: number | null): void {
    this.carViews.forEach((view) => view.setSelected(view.id === id));
  }

  async startRace(): Promise<RaceResult> {
    const promises = this.carViews.map((view) => view.startEngine());
    const startEngineResults = await Promise.allSettled(promises);

    const drivePromises = startEngineResults
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === 'fulfilled')
      .map(({ result, index }) => ({
        value: (result as PromiseFulfilledResult<number>).value,
        index,
      }))
      .map(({ value, index }) => this.carViews[index].driveCar(value));

    try {
      const winner = await Promise.any(drivePromises);
      return {
        hasWinners: true,
        winner,
      };
    } catch (e) {
      return {
        hasWinners: false,
      };
    }
  }

  resetRace(): void {
    this.carViews.forEach((view) => view.reset());
  }
}

export default CarsList;
