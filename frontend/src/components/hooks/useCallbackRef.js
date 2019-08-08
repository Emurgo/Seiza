// @flow

import {useState, useCallback} from 'react'

// The useRef doesn’t notify you when its content changes.
// Mutating the .current property doesn’t cause a re-render.ref
// See:
// https://reactjs.org/docs/hooks-reference.html#useref
// https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node

export const useCallbackRef = () => {
  const [htmlNode, setHtmlNode] = useState(null)

  const callbackRef = useCallback((node: HTMLElement) => {
    if (node !== null) {
      setHtmlNode(node)
    }
  }, [])

  return {callbackRef, htmlNode}
}
