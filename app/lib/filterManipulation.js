export default function filterArray(fullArray, responseArray) {
  const res = fullArray.filter(response => {
    const a = responseArray.filter(item => {
      if (item.value === response.value) {
        return true;
      }
    });
    return a.length > 0;
  });
  return res;
}
