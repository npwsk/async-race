import Car from '../types/car';

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
    this.container.innerHTML = `<h2>${this.name}</h2>
    <div>
      <svg fill="${this.color}" class="car-svg">
        <use xlink:href="spritemap.svg#sprite-car"></use>
      </svg>
    </div>`;

    return this.container;
  }
}

export default CarView;
