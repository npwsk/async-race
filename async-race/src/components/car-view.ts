import Car from '../types/car';
import Button from './button';

const SVG_PATH = 'spritemap.svg#sprite-car';

type Callback = (id: number) => void;

type CarViewProps = {
  car: Car;
  onDelete: Callback;
  onSelect: Callback;
  onStart: Callback;
  onStop: Callback;
};

class CarView {
  container: HTMLElement;

  id: number;

  name: string;

  color: string;

  controls: Record<'select' | 'delete' | 'start' | 'stop', Button>;

  onDelete: Callback;

  onSelect: Callback;

  onStart: Callback;

  onStop: Callback;

  constructor({
    car, onDelete, onSelect, onStart, onStop,
  }: CarViewProps) {
    this.id = car.id;
    this.name = car.name;
    this.color = car.color;
    this.container = document.createElement('div');
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
    this.onStart = onStart;
    this.onStop = onStop;
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

    const svgUseEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', SVG_PATH);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('fill', this.color);
    svg.setAttribute('viewBox', '0 0 1280 640');
    svg.classList.add('position-relative', 'car__icon');
    svg.append(svgUseEl);

    const carTrack = document.createElement('div');
    carTrack.classList.add('px-3', 'pb-0', 'border-bottom', 'border-3');
    carTrack.append(svg);

    const startBtn = this.controls.start.render();
    const stopBtn = this.controls.stop.render();

    const engineBtnGroup = document.createElement('div');
    engineBtnGroup.classList.add('btn-group', 'me-auto');
    engineBtnGroup.append(startBtn, stopBtn);

    this.container.classList.add('car', 'border-bottom', 'p-4', 'vstack', 'gap-3');
    this.container.append(header, carTrack, engineBtnGroup);

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

  handleStart(): void {
    console.log(this);
  }

  handleStop(): void {
    console.log(this);
  }
}

export default CarView;
