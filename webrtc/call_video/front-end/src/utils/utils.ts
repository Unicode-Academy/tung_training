export const getShortName = (name: string) => {
  const names = name.split(" ");
  const nameOne = names[0];
  const nameTwo = names[1];
  return nameOne.charAt(0) + nameTwo.charAt(0);
};
