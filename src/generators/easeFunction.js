/** @function
 * @name easeFunction
 * @param {Number} t
 * @param {Number} inputNumber
 */
const easeFunction = (t, inputNumber) => {
  const parts = 15
  if (t < 1 / parts) {
    // Ease in part
    const divider = Math.pow(t * parts, 3)
    return inputNumber * divider
  } else if (t > 0.5) {
    // Ease out part
    const nt = (t - 0.5) * 1 / (1 - 0.5)
    const divider = Math.abs((nt < 0.5 ? 8 * nt * nt * nt * nt : 1 - Math.pow(-2 * nt + 2, 4) / 2) - 1)
    return inputNumber * divider
  } else {
    return inputNumber
  }
}

export default easeFunction
