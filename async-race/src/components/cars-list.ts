import Car from '../types/car';
import CarView from './car-view';

type Callback = (id: number) => void;

type CarListProps = {
  cars: Car[] | null;
  onDelete: Callback;
  onSelect: Callback;
};

class CarsList {
  container: HTMLElement;

  private carViews: CarView[];

  private onDelete: Callback;

  private onSelect: Callback;

  constructor({ cars, onDelete, onSelect }: CarListProps) {
    this.container = document.createElement('div');
    this.container.classList.add('vstack', 'border', 'm-3');
    this.carViews = cars?.map((car) => new CarView(car)) ?? [];
    this.onDelete = onDelete;
    this.onSelect = onSelect;
    this.container.addEventListener('click', this);
  }

  handleEvent(e: Event): void {
    if (e.type === 'click') {
      this.handleClick(e);
    }
  }

  handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const { action } = target.dataset;
    const carEl = target.closest('[data-car-id]') as HTMLElement;
    switch (action) {
      case 'delete-car':
        this.onDelete(Number(carEl.dataset.carId));
        break;
      case 'select-car':
        this.onSelect(Number(carEl.dataset.carId));
        break;
      default:
    }
  }

  update(cars: Car[]): HTMLElement {
    if (cars === null) {
      const spinner = document.createElement('div');
      spinner.classList.add('spinner-border');
      this.container.replaceChildren(spinner);
      return this.container;
    }
    this.carViews = cars.map((car) => new CarView(car));
    this.container.replaceChildren(...this.carViews.map((view) => view.create()));
    return this.container;
  }

  setSelected(id: number | null): void {
    this.carViews.forEach((view) => view.setSelected(view.id === id));
  }
}

export default CarsList;
