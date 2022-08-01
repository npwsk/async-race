import { getCars } from '../api/garage';
import CarView from '../components/car-view';
import Car from '../types/car';
import Page from './page';

const CARS_PER_PAGE = 7;

class GaragePage extends Page {
  cars: Car[];

  currentPage: number;

  constructor(id: string) {
    super(id, 'Garage');
    this.cars = [];
    this.currentPage = 1;
  }

  async render(container: HTMLElement): Promise<void> {
    this.cars = await getCars({ limit: CARS_PER_PAGE, page: 1 });

    this.setPageAttribute(container);

    const carViews = this.cars.map((car) => new CarView(car).create());

    container.replaceChildren(this.getPageHeader(), ...carViews);
  }

  getPageHeader(): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = `<header>
      <h1>${this.title}</h1>
      page: ${this.currentPage}
      cars total: ${this.cars.length}
    </header>`;

    return container.firstElementChild as HTMLElement;
  }
}

export default GaragePage;
