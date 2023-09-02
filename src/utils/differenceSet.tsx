const differenceSet = (array1: string[], array2: string[]) => {
  return array1.filter((element) => !array2.includes(element));
};
export default differenceSet;
