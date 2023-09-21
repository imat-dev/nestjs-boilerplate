const eventEmitterConfig = {
  wildcard: false,
  delimiter: '.',
  newListener: false,
  removeListener: false,
  maxListeners: 12,
  verboseMemoryLeak: false,
  // disable throwing uncaughtException if an error event is emitted and it has no listeners
  ignoreErrors: false,
}

export default eventEmitterConfig;