import Car from '../types/car';
import CarView from './car-view';

type Callback = (id: number) => void;

type CarListProps = {
  cars: Car[] | null;
  onDelete: Callback;
  onSelect: Callback;
  onStart: Callback;
  onStop: Callback;
};

class CarsList {
  container: HTMLElement;

  private carViews: CarView[];

  private onDelete: Callback;

  private onSelect: Callback;

  private onStart: Callback;

  private onStop: Callback;

  constructor({
    cars, onDelete, onSelect, onStart, onStop,
  }: CarListProps) {
    this.container = document.createElement('div');
    this.container.classList.add('vstack', 'border', 'm-3');
    this.carViews = cars?.map((car) => new CarView({
      car, onDelete, onSelect, onStart, onStop,
    })) ?? [];
    this.onDelete = onDelete;
    this.onSelect = onSelect;
    this.onStart = onStart;
    this.onStop = onStop;
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
        onStart: this.onStart,
        onStop: this.onStop,
      }),
    );
    this.container.replaceChildren(...this.carViews.map((view) => view.render()));
    return this.container;
  }

  setSelected(id: number | null): void {
    this.carViews.forEach((view) => view.setSelected(view.id === id));
  }
}

export default CarsList;
