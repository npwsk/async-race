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
import Header from '../components/header';
import {
  createWinner, deleteWinner, getWinner, updateWinner,
} from '../api/winners';

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
  header: Header;
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
      header: new Header('Garage'),
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
      this.views.header.render(this.currentPage, this.totalCarCount);
    }
    this.views.contols.startRace.render();
    this.views.contols.resetRace.render();

    this.views.carsList.update(this.cars);
    this.views.pagination.render(this.currentPage, this.totalPages);
    this.selectCar();
  }

  async render(container: HTMLElement): Promise<void> {
    await this.update();

    const header = this.views.header.render(this.currentPage, this.totalCarCount);
    const randomBtn = this.views.contols.random.render();
    const startRace = this.views.contols.startRace.render();
    const resetRace = this.views.contols.resetRace.render();
    const createForm = this.views.contols.create.container;
    const updateForm = this.views.contols.update.container;
    const controls = document.createElement('div');
    controls.classList.add('container', 'vstack', 'gap-3');
    controls.append(createForm, updateForm, randomBtn, startRace, resetRace);
    const carsList = this.views.carsList.container;
    const pagination = this.views.pagination.render(this.currentPage, this.totalCarCount);

    this.selectCar();
    this.setPageAttribute(container);
    container.replaceChildren(header, controls, carsList, pagination, this.views.alert.render());
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
    await deleteWinner(deletedId).catch(() => {});
    await this.update(true);
    if (this.cars?.length === 0 && this.currentPage > 1) {
      this.handlePageChange(this.currentPage - 1);
    }
  }

  handleCarSelect(id: number): void {
    this.selectedCarId = this.selectedCarId !== id ? id : null;
    this.selectCar();
  }

  private selectCar(): void {
    const selectedCar = this.cars?.find((car) => car.id === this.selectedCarId);

    this.views.carsList.setSelected(this.selectedCarId);
    if (selectedCar) {
      const { name, color } = selectedCar;
      this.views.contols.update.updateValues({ name, color });
      this.views.contols.update.enable();
    } else {
      this.views.contols.update.reset();
      this.views.contols.update.disable();
    }
  }

  async handleRandomBtn(): Promise<void> {
    const cars = this.generateRandomCars(RANDOM_CARS_COUNT);
    await Promise.allSettled(cars.map((car) => createCar(car.name, car.color)));
    await this.update(true);
  }

  async handleRaceStart(): Promise<void> {
    this.views.contols.startRace.disable();
    this.views.contols.resetRace.disable();

    this.views.carsList.resetRace();
    const raceResult = await this.views.carsList.startRace();
    let title: string;
    let message: string;
    if (raceResult.hasWinners) {
      const { id, time } = raceResult.winner;
      const timeSec = time / 1000;
      title = 'Race completed with a win!';
      message = `${this.cars?.find((car) => car.id === id)?.name} won with ${timeSec.toFixed(
        2,
      )}s time`;

      await GaragePage.updateWinners(id, timeSec);
    } else {
      title = 'Race completed with no winners';
      message = '';
    }
    this.views.alert.render(title, message);
    this.views.alert.show();
    setTimeout(() => this.views.alert.hide(), 5000);

    this.views.contols.startRace.enable();
    this.views.contols.resetRace.enable();
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

  private static async updateWinners(id: number, time: number): Promise<void> {
    try {
      const winner = await getWinner(id);
      const wins = winner.wins + 1;
      const bestTime = Math.min(time, winner.time);
      await updateWinner(id, wins, bestTime);
    } catch {
      await createWinner(id, 1, time);
    }
  }
}

export default GaragePage;
