class RandomUtil {
  limitedRandom = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  randomBoolean = (coefficient, number) => {
    const randomNumber = number > coefficient ? coefficient : number;
    return Math.round(Math.random() * coefficient) === randomNumber;
  };
}

export default new RandomUtil();
