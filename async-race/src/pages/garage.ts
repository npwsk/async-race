import { createCar, getCars } from '../api/garage';
import Form from '../components/form';
import Car from '../types/car';
import Page from './page';
import CarsList from '../components/cars-list';

const CARS_PER_PAGE = 7;

type GarageElems = {
  forms: Record<string, Form>;
  carsList: CarsList;
};

class GaragePage extends Page {
  cars: Car[] | null;

  currentPage: number;

  elements: GarageElems;

  constructor(id: string) {
    super(id, 'Garage');
    this.cars = null;
    this.currentPage = 1;
    this.elements = {
      forms: {
        create: new Form('Create', async (e) => {
          const formData = new FormData(e.target as HTMLFormElement);
          const name = formData.get('car-name') as string;
          const color = formData.get('car-color') as string;
          await createCar(name, color);
          this.cars = await this.fetchCars();
          this.elements.carsList.render(this.cars);
        }),
      },
      carsList: new CarsList(this.cars),
    };
  }

  private async fetchCars(): Promise<Car[]> {
    return getCars({ limit: CARS_PER_PAGE, page: this.currentPage });
  }

  async render(container: HTMLElement): Promise<void> {
    if (this.cars === null) {
      this.cars = await this.fetchCars();
    }

    const carsList = this.elements.carsList.render(this.cars);

    const createForm = this.elements.forms.create.create();

    this.setPageAttribute(container);
    container.replaceChildren(this.getPageHeader(), createForm, carsList);
  }

  getPageHeader(): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = `<header>
      <h1>${this.title}</h1>
      page: ${this.currentPage}
      cars total: ${this.cars?.length || 0}
    </header>`;

    return container.firstElementChild as HTMLElement;
  }
}

export default GaragePage;
