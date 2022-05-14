

export function debounce<T>(fn: (...args: T[]) => void, delay = 1000) {
  let timeoutID: null | NodeJS.Timeout = null
  return function (...args: T[]) {
    timeoutID && clearTimeout(timeoutID)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    timeoutID = setTimeout(function () {
      fn.apply(that, args);
    }, delay)
  }
}
