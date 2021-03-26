/**
 * Accumulates the occurences/frequency of a value in a provided map
 *
 * @export
 * @template T The type of the value to count the occurence of
 * @param {Map<T,number>} accumulator the provided map to store the occurences of a value of type T
 * @param {T} currentValue the value to count the occurrence of 
 * @returns {Map<T,number>} the initially provided map with the occurences of all values
 *
 */
export function toFrequencyMap<T>(accumulator: Map<T, number>, currentValue: T) {
  return accumulator
    .set(
      currentValue,
      (accumulator.get(currentValue) || 0) + 1
    )
}
