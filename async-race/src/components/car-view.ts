import { startCarEngine } from '../api/engine';
import Car from '../types/car';
import Button from './button';
import CarTrack from './car-track';

type Callback<T> = (id: number) => T;

type CarViewProps = {
  car: Car;
  onDelete: Callback<void>;
  onSelect: Callback<void>;
};

class CarView {
  container: HTMLElement;

  carTrack: CarTrack;

  id: number;

  name: string;

  color: string;

  controls: Record<'select' | 'delete' | 'start' | 'stop', Button>;

  onDelete: Callback<void>;

  onSelect: Callback<void>;

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
        'btn-secondary',
        'btn-sm',
      ]),
    };
    this.onDelete = onDelete;
    this.onSelect = onSelect;
  }

  render(): HTMLElement {
    const title = document.createElement('h2');
    title.classList.add('h3', 'me-auto');
    title.textContent = this.name;

    const selectBtn = this.controls.select.render();
    const deleteBtn = this.controls.delete.render();

    const headerBtnBox = document.createElement('div');
    headerBtnBox.classList.add('hstack', 'gap-3');
    headerBtnBox.append(selectBtn, deleteBtn);

    const header = document.createElement('div');
    header.classList.add('hstack', 'gap-3', 'py-2', 'border-bottom');
    header.append(title, headerBtnBox);

    const startBtn = this.controls.start.render();
    const stopBtn = this.controls.stop.render();

    const engineBtnGroup = document.createElement('div');
    engineBtnGroup.classList.add('btn-group', 'me-auto');
    engineBtnGroup.append(startBtn, stopBtn);

    this.container.classList.add('car', 'border-bottom', 'p-4', 'vstack', 'gap-3');
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

  async handleDelete(): Promise<void> {
    this.onDelete(this.id);
  }

  async handleSelect(): Promise<void> {
    this.onSelect(this.id);
  }

  async handleStart(): Promise<void> {
    const { distance, velocity } = await startCarEngine(this.id);
    this.controls.start.disable();
    const animationTime = distance / velocity;
    this.carTrack.resetSvgPosition();
    this.carTrack.startAnimation(animationTime);
    setTimeout(() => this.controls.start.enable(), animationTime);
  }

  handleStop(): void {
    console.log(this);
  }
}

export default CarView;
