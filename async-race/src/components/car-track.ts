import CarIcon from './car-icon';

class CarTrack {
  private container: HTMLDivElement;

  private svg: CarIcon;

  private rAFId?: number;

  constructor(svgColor: string) {
    this.container = document.createElement('div');
    this.svg = new CarIcon(svgColor);
  }

  render(): HTMLDivElement {
    this.container.classList.add('px-3', 'pb-0', 'border-bottom', 'border-3');
    this.container.append(this.svg.render());

    return this.container;
  }

  startAnimation(durationMs: number): void {
    const startX = this.svg.getX() - this.container.offsetLeft;
    const endX = this.container.clientWidth - startX * 2;
    const trackWidth = endX - startX;
    const svgWidth = this.svg.getWidth();

    const draw = (progress: number): void => {
      const position = (trackWidth - svgWidth) * progress;
      this.setSvgXCoord(position, 'px');
    };

    const start = performance.now();

    const animate = (time: number): void => {
      let timeFraction = (time - start) / durationMs;

      if (timeFraction > 1) {
        timeFraction = 1;
      }

      draw(timeFraction);

      if (timeFraction < 1) {
        this.rAFId = requestAnimationFrame(animate);
      }
    };

    this.rAFId = requestAnimationFrame(animate);
  }

  stopAnimation(): void {
    if (this.rAFId) {
      cancelAnimationFrame(this.rAFId);
    }
  }

  resetSvgPosition(): void {
    this.setSvgXCoord(0, 'px');
  }

  private setSvgXCoord(x: number, unit: string): void {
    this.svg.setTransformX(x, unit);
  }
}

export default CarTrack;
