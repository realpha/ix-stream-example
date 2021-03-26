import {resolve} from 'path'
import {createReadStream} from 'fs'
import {count, of, reduce, from, toArray, AsyncIterableX as AsyncIterable} from 'ix/asynciterable'
import {flatMap, map, filter, publish, take} from 'ix/asynciterable/operators'
import {toNodeStream} from 'ix/asynciterable/tonodestream'
import {createLineTransformer as createLineTransformStream} from './stream_utils/createlinetransformer'
import {pruneLine} from './line_utils/pruneline'
import {toFrequencyMap} from './stats_utils/tofrequencymap'
import {pipeOut} from './stream_utils/pipeout'

const EXECUTION_TIME = 'executionTime'
console.time(EXECUTION_TIME)

const SOURCE_PATH = 'data/allofshakespeare.txt'
const sourcePath = resolve(SOURCE_PATH)
const sourceStream = createReadStream(sourcePath, {encoding: 'utf8'})

const whiteSpace = /\s/
const newLineChar = '\n'

type Word = string
type Count = number
type Frequency = [Word, Count]

/**
 * Prunes punctuation and whitespaces form the data and transforms a stream of lines into a stream of words.
 * By using the `publish()` operator, we can share the stream with multiple consumers.
 */
const publishedWordsStream: AsyncIterable<Word> = createLineTransformStream(sourceStream)
  .pipe(
    map(line => line.trim()),
    filter(line => line.length > 0),
    map(pruneLine),
    map(line => line.split(whiteSpace)),
    flatMap(words => of(...words)),
    filter(word => word.length > 0),
    map(word => word + newLineChar),
    publish()
  )



const wordFrequencyAggregation: Promise<Frequency[]> = reduce(publishedWordsStream, {
  seed: new Map<Word, Count>(),
  callback: toFrequencyMap
})
  .then(frequencyMap => [...frequencyMap.entries()])
  .then(frequencies => frequencies.sort((first, second) => second[1] - first[1]))

const publishedFrequencies = from(wordFrequencyAggregation)
  .pipe(
    flatMap(frequencies => of(...frequencies)),
    publish()
  )


/**
 * Ix `distinct()` operator is burning through the CPU. Therfore I rewrote this using the the keys of the frequency map as distinct words.
 * The implementation with the Ix operators `count(publishedWordsStream.pipe(distinct()))` was ~36 times slower.
 * See the old profiling report in the root directory...
 * The culprit seems to be the use of this [function](https://github.com/ReactiveX/IxJS/blob/master/src/util/arrayindexof.ts) in the distinct operator
 */
const distinctWordCount = count(publishedFrequencies)


const NUMBER_OF_TOP_OCCURENCES = 10
const ranking = publishedFrequencies
  .pipe(
    take(NUMBER_OF_TOP_OCCURENCES),
    map((frequency, i) => {
      const [word, count] = frequency
      return {rank: i + 1, word: word.trim(), count}
    })
  )


async function main() {
  /**
   * Who doesn't like a flooded terminal screen?!
   * This also beatifully demonstrates Ix's interoperability with Node's Stream API!
   */
  const PIPE_OUT_FEATURE_FLAG = process.env.PIPE_OUT
  pipeOut(PIPE_OUT_FEATURE_FLAG, toNodeStream(publishedWordsStream))

  const [totalCount, distinctCount, topTenWords] = await Promise.all([
    count(publishedWordsStream),
    distinctWordCount,
    toArray(ranking)
  ])

  console.log(`${totalCount} words in file`)
  console.log(`${distinctCount} distinct words in file`)
  console.table(topTenWords)
  console.timeEnd(EXECUTION_TIME)
}

main().catch(err => console.error(err))
