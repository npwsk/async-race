import {
  createCar, deleteCar, getCars, updateCar,
} from '../api/garage';
import Form from '../components/form';
import Car from '../types/car';
import Page from './page';
import CarsList from '../components/cars-list';
import Pagination from '../components/pagination';
import Button from '../components/button';
import getRandom from '../helpers';
import Alert from '../components/alert';

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
  create: Form<Omit<Car, 'id'>>;
  update: Form<Car>;
  random: Button;
  startRace: Button;
  resetRace: Button;
};

type GarageElems = {
  header: HTMLElement;
  contols: GarageControls;
  carsList: CarsList;
  pagination: Pagination;
  alert: Alert;
};

class GaragePage extends Page {
  cars: Car[] | null;

  totalCarCount: number;

  currentPage: number;

  totalPages: number;

  selectedCarId: number | null;

  views: GarageElems;

  constructor(id: string) {
    super(id, 'Garage');
    this.cars = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalCarCount = 0;
    this.selectedCarId = null;
    this.views = {
      contols: {
        create: new Form('Create', this.handleCarCreate.bind(this)),
        update: new Form('Update', this.handleCarUpdate.bind(this)),
        random: new Button(
          {
            label: `Generate ${RANDOM_CARS_COUNT} random cars:`,
            text: 'Generate',
            onClick: this.handleRandomBtn.bind(this),
          },
          ['btn-primary'],
        ),
        startRace: new Button(
          {
            label: 'Start race:',
            text: 'Race',
            onClick: this.handleRaceStart.bind(this),
          },
          ['btn-primary'],
        ),
        resetRace: new Button(
          {
            label: 'Reset all cars:',
            text: 'Reset',
            onClick: this.handleRaceReset.bind(this),
          },
          ['btn-primary'],
        ),
      },
      carsList: new CarsList({
        cars: this.cars,
        onDelete: this.handleCarDelete.bind(this),
        onSelect: this.handleCarSelect.bind(this),
      }),
      pagination: new Pagination(
        this.currentPage,
        this.totalPages,
        this.handlePageChange.bind(this),
      ),
      header: this.getPageHeader(),
      alert: new Alert(),
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
    const startRace = this.views.contols.startRace.render();
    const resetRace = this.views.contols.resetRace.render();
    const createForm = this.views.contols.create.container;
    const updateForm = this.views.contols.update.container;
    const controls = document.createElement('div');
    controls.classList.add('container', 'vstack', 'gap-3');
    controls.append(createForm, updateForm, randomBtn, startRace, resetRace);
    const carsList = this.views.carsList.container;
    const pagination = this.views.pagination.container;

    this.setPageAttribute(container);
    container.replaceChildren(header, controls, carsList, pagination, this.views.alert.render());
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

  async handleCarUpdate({ name, color }: Omit<Car, 'id'>): Promise<void> {
    if (this.selectedCarId === null) {
      return;
    }
    await updateCar(this.selectedCarId, name, color);
    await this.update(true);
  }

  async handleCarDelete(deletedId: number): Promise<void> {
    await deleteCar(deletedId);
    await this.update(true);
    if (this.cars?.length === 0 && this.currentPage > 1) {
      this.handlePageChange(this.currentPage - 1);
    }
  }

  handleCarSelect(id: number): void {
    this.selectedCarId = this.selectedCarId !== id ? id : null;
    const selectedCar = this.cars?.find((car) => car.id === this.selectedCarId);

    this.views.carsList.setSelected(this.selectedCarId);
    if (selectedCar) {
      const { name, color } = selectedCar;
      this.views.contols.update.updateValues({ name, color });
    } else {
      this.views.contols.update.reset();
    }
  }

  async handleRandomBtn(): Promise<void> {
    const cars = this.generateRandomCars(RANDOM_CARS_COUNT);
    await Promise.allSettled(cars.map((car) => createCar(car.name, car.color)));
    await this.update(true);
  }

  async handleRaceStart(): Promise<void> {
    const raceResult = await this.views.carsList.startRace();
    let title: string;
    let message: string;
    if (raceResult.hasWinners) {
      const { id, time } = raceResult.winner;
      const timeSec = new Date(time).getSeconds();
      title = 'Race completed with a win!';
      message = `${this.cars?.find((car) => car.id === id)?.name} won with ${timeSec}s time`;
    } else {
      title = 'Race completed with no winners';
      message = '';
    }
    this.views.alert.render(title, message);
    this.views.alert.show();
    setTimeout(() => this.views.alert.hide(), 5000);
  }

  handleRaceReset(): void {
    this.views.carsList.resetRace();
  }

  generateRandomCars(count: number): NewCar[] {
    const cars = Array(count).fill(null).map(GaragePage.getRandomCar.bind(this));
    return cars;
  }

  static getRandomCar(): NewCar {
    const brand = CAR_BRANDS[getRandom(0, CAR_BRANDS.length - 1)];
    const model = CAR_MODELS[getRandom(0, CAR_MODELS.length - 1)];
    const name = `${brand} ${model}`;
    const color = ['r', 'g', 'b']
      .map(() => getRandom(0, 255))
      .map((dec) => dec.toString(16).padStart(2, '0'))
      .join('');
    return { name, color: `#${color}` };
  }
}

export default GaragePage;
