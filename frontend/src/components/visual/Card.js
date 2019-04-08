import React from 'react'
import {Card as MuiCard} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {fade} from '@material-ui/core/styles/colorManipulator'
import {mergeStylesheets} from '@/helpers/styles'

const useStyles = makeStyles(({palette}) => {
  return {
    // TODO: add theme aware colors
    root: {
      'border': `1px solid ${fade(palette.shadowBase, 0.1)}`,
      'boxShadow': `0px 10px 20px 0px ${fade(palette.shadowBase, 0.08)}`,
      '&:hover': {
        boxShadow: `0px 10px 30px 0px ${fade(palette.shadowBase, 0.12)}`,
      },
    },
  }
})

const Card = ({children, classes: customClasses = {}, ...props}) => {
  const classes = useStyles()
  return (
    <MuiCard classes={mergeStylesheets(customClasses, classes)} {...props}>
      {children}
    </MuiCard>
  )
}

export default Card
