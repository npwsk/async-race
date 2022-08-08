const SVG_PATH = 'spritemap.svg#sprite-car';
const SVG_WIDTH = 100;
const SVG_HEIGHT = 50;

class CarIcon {
  container: SVGSVGElement;

  color: string;

  width: number;

  constructor(color: string) {
    this.container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.color = color;
    this.width = SVG_WIDTH;
  }

  render(): SVGSVGElement {
    const svgUseEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', SVG_PATH);

    this.container.setAttribute('width', `${SVG_WIDTH}px`);
    this.container.setAttribute('height', `${SVG_HEIGHT}px`);
    this.container.setAttribute('fill', this.color);
    this.container.setAttribute('viewBox', '0 0 1280 640');
    this.container.classList.add('position-relative');
    this.container.append(svgUseEl);

    return this.container;
  }

  getX(): number {
    return this.container.getBoundingClientRect().x;
  }

  setTransformX(x: number, unit: string): void {
    this.container.style.transform = `translateX(${x}${unit})`;
  }

  getWidth(): number {
    return this.width;
  }
}

export default CarIcon;
