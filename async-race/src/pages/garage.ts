import { createCar, deleteCar, getCars } from '../api/garage';
import Form from '../components/form';
import Car from '../types/car';
import Page from './page';
import CarsList from '../components/cars-list';
import Pagination from '../components/pagination';
import Button from '../components/button';
import getRandom from '../helpers';

const CARS_PER_PAGE = 7;
const RANDOM_CARS_COUNT = 100;
const CAR_BRANDS = [
  'Ford',
  'Toyota',
  'Honda',
  'Chevrolet',
  'GMC',
  'Subaru',
  'Dodge',
  'Jeep',
  'Cadillac',
  'Nissan',
];
const CAR_MODELS = [
  'Mustang',
  'Camry',
  'Civic',
  'Silverado',
  'Sierra',
  'Outback',
  'Charger',
  'Cherokee',
  'Escalade',
  'Altima',
];

type NewCar = Omit<Car, 'id'>;

type GarageControls = {
  create: Form;
  random: Button;
};

type GarageElems = {
  header: HTMLElement;
  contols: GarageControls;
  carsList: CarsList;
  pagination: Pagination;
};

class GaragePage extends Page {
  cars: Car[] | null;

  totalCarCount: number;

  currentPage: number;

  totalPages: number;

  views: GarageElems;

  constructor(id: string) {
    super(id, 'Garage');
    this.cars = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalCarCount = 0;
    this.views = {
      contols: {
        create: new Form('Create', this.handleCarCreate.bind(this)),
        random: new Button(
          {
            label: `Generate ${RANDOM_CARS_COUNT} random cars`,
            text: 'Generate',
            onClick: this.handleRandomBtn.bind(this),
          },
          ['btn-primary'],
        ),
      },
      carsList: new CarsList(this.cars, {
        onDelete: this.handleCarDelete.bind(this),
      }),
      pagination: new Pagination(
        this.currentPage,
        this.totalPages,
        this.handlePageChange.bind(this),
      ),
      header: this.getPageHeader(),
    };
  }

  private async fetchCars(): Promise<{ cars: Car[]; total: number }> {
    return getCars({ limit: CARS_PER_PAGE, page: this.currentPage });
  }

  async update(shouldFetch = false): Promise<void> {
    if (shouldFetch || this.cars === null) {
      const { cars, total } = await this.fetchCars();
      this.cars = cars;
      this.totalCarCount = total;
      this.totalPages = Math.ceil(total / CARS_PER_PAGE);
      this.views.header.replaceWith(this.getPageHeader());
    }
    this.views.carsList.update(this.cars);
    this.views.pagination.update(this.currentPage, this.totalPages);
  }

  async render(container: HTMLElement): Promise<void> {
    await this.update();

    const header = this.getPageHeader();
    const randomBtn = this.views.contols.random.render();
    const createForm = this.views.contols.create.container;
    const controls = document.createElement('div');
    controls.classList.add('container');
    controls.append(createForm, randomBtn);
    const carsList = this.views.carsList.container;
    const pagination = this.views.pagination.container;

    this.setPageAttribute(container);
    container.replaceChildren(header, controls, carsList, pagination);
  }

  getPageHeader(): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = `<header>
      <h1>${this.title}</h1>
      page: ${this.currentPage}
      cars total: ${this.totalCarCount}
    </header>`;

    return container.firstElementChild as HTMLElement;
  }

  handlePageChange(newActivePage: number): void {
    this.currentPage = newActivePage;
    this.update(true);
  }

  async handleCarCreate({ name, color }: Omit<Car, 'id'>): Promise<void> {
    await createCar(name, color);
    await this.update(true);
  }

  async handleCarDelete(deletedId: number): Promise<void> {
    await deleteCar(deletedId);
    await this.update(true);
    if (this.cars?.length === 0 && this.currentPage > 1) {
      this.handlePageChange(this.currentPage - 1);
    }
  }

  async handleRandomBtn(): Promise<void> {
    const cars = this.generateRandomCars(RANDOM_CARS_COUNT);
    await Promise.allSettled(cars.map((car) => createCar(car.name, car.color)));
    await this.update(true);
  }

  generateRandomCars(count: number): NewCar[] {
    const cars = Array(count).fill(null).map(GaragePage.getRandomCar.bind(this));
    return cars;
  }

  static getRandomCar(): NewCar {
    const brand = CAR_BRANDS[getRandom(0, CAR_BRANDS.length - 1)];
    const model = CAR_MODELS[getRandom(0, CAR_MODELS.length - 1)];
    const name = `${brand} ${model}`;
    const colors = ['r', 'g', 'b'].map(() => getRandom(0, 255));
    const color = `rgb(${colors.join(', ')})`;
    return { name, color };
  }
}

export default GaragePage;
