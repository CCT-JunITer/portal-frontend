

export const debounce = (fn: (...params: any[]) => any, delay = 1000, immed = false) => {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]) {
    if (timer === null && immed) {
      fn.apply(this, args);
    }
    timer && clearTimeout(timer);
    timer = setTimeout(() => { 
      fn.apply(this, args)
      timer = null
    }, delay);
    return timer;
  }
};
