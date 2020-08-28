export const zipArray = (arr1, arr2) => {
  return arr1.map((k, i) => {
    return [k, arr2[i]]
  })
}
