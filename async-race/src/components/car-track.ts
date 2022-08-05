import { startAnimation } from '../helpers';

const SVG_PATH = 'spritemap.svg#sprite-car';
const SVG_WIDTH = 100;
const SVG_HEIGHT = 50;

class CarTrack {
  private container: HTMLDivElement;

  private svg: SVGSVGElement;

  private svgColor: string;

  constructor(svgColor: string) {
    this.container = document.createElement('div');
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgColor = svgColor;
  }

  render(): HTMLDivElement {
    const svgUseEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svgUseEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', SVG_PATH);

    this.svg.setAttribute('width', `${SVG_WIDTH}px`);
    this.svg.setAttribute('height', `${SVG_HEIGHT}px`);
    this.svg.setAttribute('fill', this.svgColor);
    this.svg.setAttribute('viewBox', '0 0 1280 640');
    this.svg.classList.add('position-relative');
    this.svg.append(svgUseEl);

    this.container.classList.add('px-3', 'pb-0', 'border-bottom', 'border-3');
    this.container.append(this.svg);

    return this.container;
  }

  startAnimation(durationMs: number): void {
    const startX = this.svg.getBoundingClientRect().x - this.container.offsetLeft;
    const endX = this.container.clientWidth - startX * 2;
    const trackWidth = endX - startX;

    startAnimation({
      durationMs,
      draw: (progress) => {
        const position = (trackWidth - SVG_WIDTH) * progress;
        this.setSvgXCoord(position, 'px');
      },
    });
  }

  resetSvgPosition(): void {
    this.setSvgXCoord(0, 'px');
  }

  private setSvgXCoord(x: number, unit: string): void {
    this.svg.style.transform = `translateX(${x}${unit})`;
  }
}

export default CarTrack;
