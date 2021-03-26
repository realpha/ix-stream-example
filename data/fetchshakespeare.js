const https = require('https')
const {resolve} = require('path')
const {createWriteStream} = require('fs')


const TIMER = 'timer'
console.time(TIMER)

// Here if you really want to re-fetch or check the source. But pls be polite!
https.get('https://ocw.mit.edu/ans7870/6/6.006/s08/lecturenotes/files/t8.shakespeare.txt', function (res) {
  const path = resolve('data/allofshakespeare.txt')
  const sink = createWriteStream(path, {encoding: 'utf8'})

  res.pipe(sink)
    .on('open', () => {
      console.log('Starting to write to sink!')
    })
    .on('close', () => {
      console.log(`Done downloading all of Shakespeare!`)
      console.timeEnd(TIMER)
    })

})
