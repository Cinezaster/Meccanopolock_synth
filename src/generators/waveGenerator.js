/** @function
 * @name waveGenerator
 * @param {Number} t
 * @param {Array<Number>} inputNumbers
 * @param {Number} repetition
 */
const waveGenerator = (t, inputNumbers = [1], repetition = 1) => {
  let output = 0
  for (const inputNumber of inputNumbers) {
    output += Math.sin((t * repetition) * inputNumber)
  }
  return output / inputNumbers.length
}

export default waveGenerator
