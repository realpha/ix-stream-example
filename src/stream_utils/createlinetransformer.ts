import {Readable} from 'stream'
import {from, AsyncIterableX as AsyncIterable} from 'ix/asynciterable'
import * as readline from 'readline'

/**
 * Creates a line reader as AsyncIterableX from a given Readable stream 
 *
 * @exports
 * @param {Readable} inputStream the source stream 
 * @returns {AsyncIterableX<string>} the line reader
 *
 */
export function createLineTransformer(inputStream: Readable): AsyncIterable<string> {

  // https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
  const reader = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  })

  return from(reader)
}


