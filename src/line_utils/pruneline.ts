const punctuation = /[\W\(\)]+/g
const lonelyGenetiveS = /\bs\b/g
const doubleWhitespace = /[\s{2,}]+/g
const digits = /\d+/

/**
 * Purely removes all punctuation, genetive s', digits and abundant whitespaces from a given string
 *
 * @exports
 * @param {string} line The input string
 * @returns {string} A new, prunded string
 */
export const pruneLine = (line: string): string => {
  return line.toLowerCase()
    .replace(punctuation, ' ')
    .replace(lonelyGenetiveS, '')
    .replace(digits, ' ')
    .replace(doubleWhitespace, ' ')
    .trim()
}
