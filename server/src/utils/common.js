function checkNullOrUndefined (...args) {
  for (const arg of args) {
    if (arg === null || arg === undefined) {
      return true
    }
  }
  return false
}
function compareThreshold (value, upper, lower) {
  return !(value >= lower && value <= upper)
}
export const CommonUtils = {
  checkNullOrUndefined,
  compareThreshold
}
