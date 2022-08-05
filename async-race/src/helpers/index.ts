const getRandom = (from: number, to: number): number => {
  const random = Math.floor(Math.random() * (to - from + 1) + from);
  return random;
};

type AnimateProps = {
  draw: (progress: number) => void;
  durationMs: number;
};

const startAnimation = ({ draw, durationMs }: AnimateProps): void => {
  const start = performance.now();

  const animate = (time: number): void => {
    let timeFraction = (time - start) / durationMs;

    if (timeFraction > 1) {
      timeFraction = 1;
    }

    draw(timeFraction);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

export { getRandom, startAnimation };
