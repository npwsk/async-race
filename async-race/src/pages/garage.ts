import getAllCars from '../api/garage';
import Car from '../types/car';
import Page from './page';

class GaragePage extends Page {
  cars: Car[];

  currentPage: number;

  constructor(id: string) {
    super(id, 'Garage');
    this.cars = [];
    this.currentPage = 1;
  }

  async render(container: HTMLElement): Promise<void> {
    this.cars = await getAllCars();

    this.setPageAttribute(container);
    container.replaceChildren(this.getPageHeader());
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
