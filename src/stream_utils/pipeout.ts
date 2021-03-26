import {Readable} from 'stream'

function noOp() {}

export function pipeOut(featureFlag: string | undefined, stream: Readable): void {
  featureFlag
    ? stream.pipe(process.stdout)
    : noOp()
}
