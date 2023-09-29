export const generateRandomText = (length: number) => {
  let text = '';
  for (let i = 0; i < length; i++) {
    text += String.fromCharCode(Math.floor(Math.random() * 75 + 48));
  }
  return text;
};
