## Motivation

The [ReactiveX](http://reactivex.io/) stream API has been widely adopted over the last years in the industry and in open source ecosystems (e.g. [RxJS](https://rxjs-dev.firebaseapp.com/) in Angular, or [RxJava at Netfilx](https://netflixtechblog.com/tagged/rxjava)).
Node also provides a native Stream API for most I/O bound tasks which is also highly usable on it's own. If you are comfortable writing most of the flow and transformation logic yourself or using packages of various age. This can be especially challenging for new team members, who just start to wrap their head around the concept of streams in general and get overwhelmed by all the different APIs, packages and fancy names (e.g. the [M-word](https://en.wikipedia.org/wiki/Monad_functional_programming))

Streams are hard to learn, therefore it would be good if we can get accustomed with one API which we can use in different contexts. Rx is widely adopted and documented well, so it seems to be a viable candidate. We can use it in the frontend, in the backend and the API (more specifically the operators) are implemented in a myriad of other languages.

There is just one problem: RxJs is *purely reactive*, meaning that the observable streams don't support [backpressure](https://nodejs.org/en/docs/guides/backpressuring-in-streams/). This makes them unsuitable to interoperate with native streams in backend for most use cases. Luckily, a few smart and competent people were motivated enough and come up with a solution: [IxJs](https://github.com/ReactiveX/IxJS).

Ix is also part of the ReactiveX project, provides a Rx compatible API, is based upon AsyncIterators and plays very well with Node's native stream API.

## Use case

To explore a few of it's features, I developed a `wc` inspired, small utility script. It's not overly configurable but the defaults should be enough to give an impression of Ix's capabilities.
The script creates a read stream from a file, applies some projection functions and collects & calculates some data about the contents of the file while it is at it.


## Installation

```bash
$ (p)npm install
```

## Build

```bash
$ (p)npm run build
```

## Running the app

```bash
# Without output stream
$ (p)npm run start 

# With output stream
$ PIPE_OUT=<ANY_STRING> (p)npm run start

```


## Conclusion

The stream abstraction provided by IxJS is highly composable and ergonomic compared to native transform streams (or through2, split2 et.al.) for example. I particularly enjoyed the great [interoperability](https://github.com/ReactiveX/IxJS/blob/master/docs/asynciterable/converting.md#creating-a-sequence-from-a-node-stream) with Node's native Readable and Writable streams. This also means great interoperability with an awful lot of dedicated stream implementations in the [ecosystem](https://www.npmjs.com/package/csv).

Although documentation is quite sparse and I don't have a deep knowledge of the Rx API, the resources I found for RxJS helped me greatly with understanding the use cases and behaviors of the different operators (I think...).
Additionally, the usage of IxJS and RxJS is not mutually exclusive. E.g. you can easily [convert your RxJS Observable to an IxJS AsyncIterator](https://github.com/ReactiveX/IxJS/blob/master/docs/asynciterable/converting.md#creating-a-sequence-from-an-observable). 

To summarize: 
- The Rx family provides a nearly universal and ergonomic abstraction for (reactive) streams
- In comparison to other stream APIs, IxJS and RxJS especially shine when the use case calls for a lot of branching, type lifting and/or complex projections
- For Push based APIs (such as DOM events) RxJS
- For Pull based APIs (such as sockets or files) IxJS seems to be more suitable

## Tidbits

For those interested in the discussion on why RxJS doesn't support backpressure, here the link to the thread on [Github](https://github.com/ReactiveX/rxjs/issues/71) 

Another important topic regarding the different use cases of RxJS and IxJS and closely related to the topic of backpressure: [Push vs. Pull APIs](https://stackoverflow.com/questions/51254117/what-is-difference-between-push-based-and-pull-based-structures-like-ienumerable)

Ultimately, a lot of the interoperability benefits of IxJS stem from the foundational AsyncIterators. Read more [here.](https://github.com/tc39/proposal-async-iteration)

## Disclaimer

Based upon the always helpful [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

All opinions expressed are my own and do not reflect the opinion of my employer(s).

## License

[MIT](./LICENSE).
