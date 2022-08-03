import { createCar, getCars } from '../api/garage';
import Form from '../components/form';
import Car from '../types/car';
import Page from './page';
import CarsList from '../components/cars-list';
import Pagination from '../components/pagination';

const CARS_PER_PAGE = 7;

type GarageElems = {
  forms: Record<string, Form>;
  carsList: CarsList;
  pagination: Pagination;
};

class GaragePage extends Page {
  cars: Car[] | null;

  currentPage: number;

  totalPages: number;

  views: GarageElems;

  constructor(id: string) {
    super(id, 'Garage');
    this.cars = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.views = {
      forms: {
        create: new Form('Create', async ({ name, color }: Omit<Car, 'id'>) => {
          await createCar(name, color);
          await this.update(true);
        }),
      },
      carsList: new CarsList(this.cars),
      pagination: new Pagination(this.currentPage, this.totalPages, (newActive: number) => {
        this.currentPage = newActive;
        this.update(true);
      }),
    };
  }

  private async fetchCars(): Promise<{ cars: Car[]; total: number }> {
    return getCars({ limit: CARS_PER_PAGE, page: this.currentPage });
  }

  async update(shouldFetch = false): Promise<void> {
    if (shouldFetch || this.cars === null) {
      const { cars, total } = await this.fetchCars();
      this.cars = cars;
      this.totalPages = Math.ceil(total / CARS_PER_PAGE);
    }
    this.views.carsList.update(this.cars);
    this.views.pagination.update(this.currentPage, this.totalPages);
  }

  async render(container: HTMLElement): Promise<void> {
    await this.update();

    const carsList = this.views.carsList.container;
    const createForm = this.views.forms.create.container;
    const pagination = this.views.pagination.container;

    this.setPageAttribute(container);
    container.replaceChildren(this.getPageHeader(), createForm, carsList, pagination);
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
