type AnyFunction = (...args: any[]) => any

export const compose = (...fns: AnyFunction[]): AnyFunction => fns.reduce((f, g) => (...args: any[]) => f(g(...args)));
