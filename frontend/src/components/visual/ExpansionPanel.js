import React from 'react'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {makeStyles} from '@material-ui/styles'

import {Card} from '@/components/visual'
import {mergeStylesheets} from '@/helpers/styles'

const useExpansionDetailsStyles = makeStyles((theme) => ({
  root: {
    flexDirection: 'column',
    padding: 0,
  },
}))

const useExpansionSummaryStyles = makeStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: theme.getContentSpacing(0.5),
    marginRight: theme.getContentSpacing(0.5),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.getContentSpacing(),
      marginRight: theme.getContentSpacing(),
    },
  },
}))

const useStyles = makeStyles((theme) => ({
  expanded: {
    margin: 0,
  },
}))

const ExpansionPanel = (props) => {
  const {classes: customClasses = {}, className, summary, children, ...restProps} = props
  const classes = useStyles()
  const summaryClasses = useExpansionSummaryStyles()
  const detailsClasses = useExpansionDetailsStyles()
  return (
    <Card className={className}>
      <MuiExpansionPanel classes={mergeStylesheets(classes, customClasses)} {...restProps}>
        <MuiExpansionPanelSummary
          classes={summaryClasses}
          expandIcon={<ExpandMoreIcon color="primary" />}
        >
          {summary}
        </MuiExpansionPanelSummary>
        <MuiExpansionPanelDetails classes={detailsClasses}>{children}</MuiExpansionPanelDetails>
      </MuiExpansionPanel>
    </Card>
  )
}

export default ExpansionPanel
