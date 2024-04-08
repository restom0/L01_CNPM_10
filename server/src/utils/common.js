function checkNullOrUndefined(...args) {
  for (const arg of args) {
    if (arg === null || arg === undefined) {
      return true
    }
  }
  return false
}
function compareThreshold(value, upper, lower) {
  if (value >= lower && value <= upper) return false
  return true
}
export const CommonUtils = {
  checkNullOrUndefined,
  compareThreshold
}
