// @flow
import {lifecycle} from 'recompose'
import type {HOC} from 'recompose'

export const onDidUpdate = <Props: {}, PrevProps: {}>(
  didUpdate: (Props, PrevProps) => any
): HOC<Props, Props> =>
    lifecycle({
      componentDidUpdate(prevProps) {
        didUpdate(this.props, prevProps)
      },
    })

export const onDidMount = <Props: {}>(didMount: (Props) => any): HOC<Props, Props> =>
  lifecycle({
    componentDidMount() {
      didMount(this.props)
    },
  })
