import {
  createCar, deleteCar, getCars, updateCar,
} from '../api/garage';
import Form from '../components/form';
import Car from '../types/car';
import Page from '../base/page';
import CarsList from '../components/cars-list';
import Button from '../components/button';
import getRandom from '../helpers';
import Alert from '../components/alert';
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

class GaragePage extends Page {
  private cars: Car[];

  private selectedCarId: number | null;

  private contols: GarageControls;

  private carsList: CarsList;

  private alert: Alert;

  constructor(id: string) {
    super(id, 'Garage');
    this.cars = [];
    this.selectedCarId = null;
    this.contols = {
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
    };
    this.carsList = new CarsList({
      cars: this.cars,
      onDelete: this.handleCarDelete.bind(this),
      onSelect: this.handleCarSelect.bind(this),
    });
    this.alert = new Alert();
  }

  async fetch(): Promise<void> {
    const { cars, total } = await getCars({ limit: CARS_PER_PAGE, page: this.state.currentPage });
    this.cars = cars;
    this.state.totalItems = total;
    this.state.totalPages = Math.ceil(total / CARS_PER_PAGE);
  }

  render(): typeof this.container {
    super.render();

    const randomBtn = this.contols.random.render();
    const startRace = this.contols.startRace.render();
    const resetRace = this.contols.resetRace.render();
    const createForm = this.contols.create.container;
    const updateForm = this.contols.update.container;
    const controls = document.createElement('div');
    controls.classList.add('container', 'vstack', 'gap-3');
    controls.append(createForm, updateForm, randomBtn, startRace, resetRace);
    const carsList = this.carsList.container;
    const pagination = this.pagination.render(this.state.currentPage, this.state.totalPages);

    this.header.render(this.state.currentPage, this.state.totalItems);
    this.contols.startRace.render();
    this.contols.resetRace.render();

    this.carsList.update(this.cars);
    this.pagination.render(this.state.currentPage, this.state.totalPages);
    this.selectCar();

    this.selectCar();
    this.container.append(controls, carsList, pagination, this.alert.render());
    return this.container;
  }

  async handleCarCreate({ name, color }: Omit<Car, 'id'>): Promise<void> {
    await createCar(name, color);
    await this.fetch();
    this.render();
  }

  async handleCarUpdate({ name, color }: Omit<Car, 'id'>): Promise<void> {
    if (this.selectedCarId === null) {
      return;
    }
    await updateCar(this.selectedCarId, name, color);
    await this.fetch();
    this.render();
  }

  async handleCarDelete(deletedId: number): Promise<void> {
    await deleteCar(deletedId);
    await deleteWinner(deletedId).catch(() => {});
    await this.fetch();
    this.render();
    if (this.cars?.length === 0 && this.state.currentPage > 1) {
      this.handlePageChange(this.state.currentPage - 1);
    }
  }

  handleCarSelect(id: number): void {
    this.selectedCarId = this.selectedCarId !== id ? id : null;
    this.selectCar();
  }

  private selectCar(): void {
    const selectedCar = this.cars?.find((car) => car.id === this.selectedCarId);

    this.carsList.setSelected(this.selectedCarId);
    if (selectedCar) {
      const { name, color } = selectedCar;
      this.contols.update.updateValues({ name, color });
      this.contols.update.enable();
    } else {
      this.contols.update.reset();
      this.contols.update.disable();
    }
  }

  async handleRandomBtn(): Promise<void> {
    const cars = this.generateRandomCars(RANDOM_CARS_COUNT);
    await Promise.allSettled(cars.map((car) => createCar(car.name, car.color)));
    await this.fetch();
    this.render();
  }

  async handleRaceStart(): Promise<void> {
    this.contols.startRace.disable();
    this.contols.resetRace.disable();

    this.carsList.resetRace();
    const raceResult = await this.carsList.startRace();
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
    this.alert.render(title, message);
    this.alert.show();
    setTimeout(() => this.alert.hide(), 5000);

    this.contols.startRace.enable();
    this.contols.resetRace.enable();
  }

  handleRaceReset(): void {
    this.carsList.resetRace();
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
