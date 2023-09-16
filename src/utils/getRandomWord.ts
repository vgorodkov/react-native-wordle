export const getRandomWord = (wordsArray: string[]) => {
  const randomIndex = Math.floor(Math.random() * wordsArray.length);
  return wordsArray[randomIndex];
};
