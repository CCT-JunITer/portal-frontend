

export const debounce = (fn: (...params: any[]) => any, delay = 1000, immed = false) => {
  let timer: number | null = null;
  return function (this: any, ...args: any[]) {
    let calledImmediate = false;
    if (timer === null && immed) {
      fn.apply(this, args);
      calledImmediate = true;
    }
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      if (!calledImmediate) {
        fn.apply(this, args)
      }
      timer = null
    }, delay);
    return timer;
  }
};
