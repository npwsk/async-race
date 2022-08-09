import { driveCar, startCarEngine, stopCarEngine } from '../api/engine';
import Car from '../types/car';
import Button from './button';
import CarTrack from './car-track';

type Callback<T> = (id: number) => T;

enum CarState {
  Ready = 'ready',
  Starting = 'starting',
  Stopped = 'stopped',
  Stopping = 'stopping',
  Driving = 'driving',
}

type CarViewProps = {
  car: Car;
  onDelete: Callback<void>;
  onSelect: Callback<void>;
};

class CarView {
  readonly id: number;

  private container: HTMLElement;

  private carTrack: CarTrack;

  private name: string;

  private color: string;

  private controls: Record<'select' | 'delete' | 'start' | 'stop', Button>;

  private onDelete: Callback<void>;

  private onSelect: Callback<void>;

  private state: CarState;

  constructor({ car, onDelete, onSelect }: CarViewProps) {
    this.id = car.id;
    this.name = car.name;
    this.color = car.color;
    this.container = document.createElement('div');
    this.carTrack = new CarTrack(this.color);
    this.controls = {
      delete: new Button({ text: 'Delete', onClick: this.handleDelete.bind(this) }, [
        'btn-danger',
        'btn-sm',
      ]),
      select: new Button({ text: 'Select', onClick: this.handleSelect.bind(this) }, [
        'btn-outline-primary',
        'btn-sm',
      ]),
      start: new Button({ text: 'Start', onClick: this.handleStart.bind(this) }, [
        'btn-primary',
        'btn-sm',
      ]),
      stop: new Button({ text: 'Stop', onClick: this.handleStop.bind(this) }, [
        'btn-primary',
        'btn-sm',
      ]),
    };
    this.onDelete = onDelete;
    this.onSelect = onSelect;
    this.state = CarState.Ready;
    this.disableButtons();
  }

  render(): HTMLElement {
    const title = document.createElement('h2');
    title.classList.add('h3');
    title.textContent = this.name;

    const selectBtn = this.controls.select.render();
    const deleteBtn = this.controls.delete.render();

    const headerBtnBox = document.createElement('div');
    headerBtnBox.classList.add('hstack', 'gap-2');
    headerBtnBox.append(selectBtn, deleteBtn);

    const header = document.createElement('div');
    header.classList.add('d-flex', 'flex-wrap', 'gap-2', 'py-2', 'border-bottom');
    header.append(title, headerBtnBox);

    const startBtn = this.controls.start.render();
    const stopBtn = this.controls.stop.render();

    const engineBtnGroup = document.createElement('div');
    engineBtnGroup.classList.add('btn-group', 'me-auto');
    engineBtnGroup.append(startBtn, stopBtn);

    this.container.classList.add('border-bottom', 'p-4', 'vstack', 'gap-3');
    this.container.append(header, this.carTrack.render(), engineBtnGroup);

    return this.container;
  }

  setSelected(isSelected: boolean): void {
    if (isSelected) {
      this.container.classList.add('bg-primary');
    } else {
      this.container.classList.remove('bg-primary');
    }
  }

  private async handleDelete(): Promise<void> {
    this.onDelete(this.id);
  }

  private async handleSelect(): Promise<void> {
    this.onSelect(this.id);
  }

  private async handleStart(): Promise<void> {
    const animationTime = await this.startEngine();

    await this.driveCar(animationTime).catch(() => {});
  }

  private async handleStop(): Promise<void> {
    if (this.state === CarState.Stopped) {
      this.reset();
      return;
    }
    if (this.state === CarState.Driving) {
      this.setState(CarState.Stopping);

      await stopCarEngine(this.id);
      this.carTrack.stopAnimation();
      this.reset();
    }
  }

  async startEngine(): Promise<number> {
    this.setState(CarState.Starting);

    const { distance, velocity } = await startCarEngine(this.id);
    const estimatedTime = distance / velocity;
    return estimatedTime;
  }

  async driveCar(estimatedTime: number): Promise<{ id: number; time: number }> {
    try {
      this.setState(CarState.Driving);

      this.carTrack.startAnimation(estimatedTime);

      await driveCar(this.id);

      this.setState(CarState.Stopped);
      return { id: this.id, time: estimatedTime };
    } catch (e) {
      this.setState(CarState.Stopped);
      this.carTrack.stopAnimation();
      throw e;
    }
  }

  reset(): void {
    this.setState(CarState.Ready);
    this.carTrack.resetSvgPosition();
  }

  private setState(state: CarState): void {
    this.state = state;
    this.disableButtons();
  }

  private disableButtons(): void {
    this.controls.start.enable();
    this.controls.stop.enable();
    this.controls.select.enable();
    this.controls.delete.enable();

    switch (this.state) {
      case CarState.Ready:
        this.controls.stop.disable();
        break;
      case CarState.Stopped:
        this.controls.start.disable();
        break;
      case CarState.Starting:
      case CarState.Stopping:
        this.controls.start.disable();
        this.controls.stop.disable();
        this.controls.select.disable();
        this.controls.delete.disable();
        break;
      case CarState.Driving:
        this.controls.start.disable();
        this.controls.select.disable();
        this.controls.delete.disable();
        break;
      default:
    }
  }
}

export default CarView;
