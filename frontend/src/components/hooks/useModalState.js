// @flow
import {useState, useCallback} from 'react'

const useModalState = () => {
  const [isOpen, setIsOpen] = useState(false)
  const openModal = useCallback(() => setIsOpen(true), [setIsOpen])
  const closeModal = useCallback(() => setIsOpen(false), [setIsOpen])
  const toggle = useCallback(() => setIsOpen((isOpen) => !isOpen), [setIsOpen])
  return {isOpen, openModal, closeModal, toggle}
}

export default useModalState
