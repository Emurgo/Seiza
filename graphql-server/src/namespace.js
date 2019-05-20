import cls from 'continuation-local-storage'

export const tracingContext = cls.createNamespace('tracing')
