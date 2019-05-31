import {useEffect} from 'react'

// https://github.com/facebook/react/issues/14195
export const useRequestAnimationFrame = (callback, isDisplaying = true) => {
  let isCancelled = false

  const loop = () => {
    if (!isDisplaying || isCancelled) {
      return
    }
    callback()
    window.requestAnimationFrame(loop)
  }

  useEffect(() => {
    window.requestAnimationFrame(loop)
    return () => {
      // eslint-disable-next-line
      isCancelled = true
    }
  })
}
