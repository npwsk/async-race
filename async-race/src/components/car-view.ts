import Car from '../types/car';

const SVG_PATH = 'spritemap.svg#sprite-car';

class CarView {
  container: HTMLElement;

  id: number;

  name: string;

  color: string;

  constructor({ id, name, color }: Car) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.container = document.createElement('div');
  }

  create(): HTMLElement {
    this.container.setAttribute('data-car-id', this.id.toString());
    this.container.classList.add('car', 'border-bottom', 'p-4', 'vstack', 'gap-3');
    this.container.innerHTML = `<div class="hstack gap-3 py-2 border-bottom">
      <h2 class="h3 me-auto">${this.name}</h2>
      <button class="btn btn-outline-primary btn-sm" data-action="select-car">Select</button>
      <div class="vr"></div>
      <button class="btn btn-danger btn-sm" data-action="delete-car">Delete</button>
    </div>

    <div class="car__track px-3 pb-0 border-bottom border-3">
      <svg fill="${this.color}" class="car__icon position-relative" viewBox="0 0 1280 640" fill="lightgreen">
        <use xlink:href="${SVG_PATH}"></use>
      </svg>
    </div>

    <div class="btn-group me-auto">
      <button class="btn btn-primary btn-sm">Start</button>
      <button class="btn btn-secondary btn-sm">Stop</button>
    </div>`;

    return this.container;
  }

  setSelected(isSelected: boolean): void {
    if (isSelected) {
      this.container.classList.add('bg-primary');
    } else {
      this.container.classList.remove('bg-primary');
    }
  }
}

export default CarView;
