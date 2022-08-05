const getRandom = (from: number, to: number): number => {
  const random = Math.floor(Math.random() * (to - from + 1) + from);
  return random;
};

export default getRandom;
