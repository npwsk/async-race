import Car from '../types/car';
import CarView from './car-view';

class CarsList {
  container: HTMLElement;

  private cars: Car[] | null;

  constructor(cars: Car[] | null) {
    this.cars = cars;
    this.container = document.createElement('div');
    this.container.classList.add('vstack', 'border', 'm-3');
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
