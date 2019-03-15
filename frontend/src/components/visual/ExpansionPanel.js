import React from 'react'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {makeStyles} from '@material-ui/styles'

const useExpansionDetailsStyles = makeStyles((theme) => ({
  root: {
    flexDirection: 'column',
    padding: 24,
  },
}))

const useExpansionSummaryStyles = makeStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
    padding: 0,
    margin: '0 24px',
  },
  expandIcon: {
    right: '-16px',
  },
}))

const useStyles = makeStyles((theme) => ({
  expanded: {
    margin: 0,
  },
}))

const ExpansionPanel = (props) => {
  const {classes, summary, children, ...restProps} = props
  const summaryClasses = useExpansionSummaryStyles()
  const detailsClasses = useExpansionDetailsStyles()
  return (
    <MuiExpansionPanel classes={{...useStyles(), ...classes}} {...restProps}>
      <MuiExpansionPanelSummary
        classes={summaryClasses}
        expandIcon={<ExpandMoreIcon color="primary" />}
      >
        {summary}
      </MuiExpansionPanelSummary>
      <MuiExpansionPanelDetails classes={detailsClasses}>{children}</MuiExpansionPanelDetails>
    </MuiExpansionPanel>
  )
}

export default ExpansionPanel
