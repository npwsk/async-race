import Car from '../types/car';
import CarView from './car-view';

type Callback<T> = (id: number) => T;

type CarListProps = {
  cars: Car[] | null;
  onDelete: Callback<void>;
  onSelect: Callback<void>;
};

class CarsList {
  container: HTMLElement;

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
    return this.container;
  }

  setSelected(id: number | null): void {
    this.carViews.forEach((view) => view.setSelected(view.id === id));
  }
}

export default CarsList;
