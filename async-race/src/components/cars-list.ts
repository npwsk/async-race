import Car from '../types/car';
import CarView from './car-view';

type OnDeleteCallback = (id: number) => void;

class CarsList {
  container: HTMLElement;

  private cars: Car[] | null;

  private onDelete: OnDeleteCallback;

  constructor(cars: Car[] | null, callbacks: { onDelete: OnDeleteCallback }) {
    this.container = document.createElement('div');
    this.container.classList.add('vstack', 'border', 'm-3');
    this.cars = cars;
    this.onDelete = callbacks.onDelete;
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
    const carViews = cars.map((car) => new CarView(car).create());
    this.container.replaceChildren(...carViews);
    return this.container;
  }
}

export default CarsList;
