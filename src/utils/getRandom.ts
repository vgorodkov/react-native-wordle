export const getRandomImg = (imgs: number[]) => {
  const randomIndex = Math.floor(Math.random() * imgs.length);
  return imgs[randomIndex];
};
