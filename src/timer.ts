import EventEmitter from 'eventemitter3'

const timeout = 10 * 1000
const eventName = 'tick'
const globalTimer = new EventEmitter()

setInterval(() => {
  globalTimer.emit(eventName)
}, timeout)

export function subscribeTick(handler: () => void) {
  globalTimer.on(eventName, handler)
}

export function unsubscribeTick(handler: () => void) {
  globalTimer.off(eventName, handler)
}
