// @flow
import React from 'react'
import type {Node} from 'react'
import cn from 'classnames'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Paper,
  Typography,
  Grid,
  IconButton,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  icon: {
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
  iconExpanded: {
    transform: 'rotate(180deg)',
  },
  mainContent: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  spacing: {
    marginRight: theme.spacing.unit * 0.5,
  },
}))

const useExpansionPanelClasses = makeStyles((theme) => ({
  root: {
    'display': 'flex',
    'flexDirection': 'column',
    '& > :first-child': {
      order: 1,
    },
    'margin': 0,
    'borderTopRightRadius': '0 !important',
    'borderTopLeftRadius': '0 !important',
    'boxShadow': 'none',
  },
}))

const useSummaryClasses = makeStyles((theme) => ({
  root: {
    margin: '0 !important',
    minHeight: 'auto !important',
    borderTop: `1px solid ${theme.palette.unobtrusiveContentHighlight}`,
  },
  content: {
    margin: '0 !important',
    minHeight: 'auto !important',
  },
}))

const useDetailsClasses = makeStyles((theme) => ({
  root: {
    padding: 0,
  },
}))

const useFooterClasses = makeStyles((theme) => ({
  root: {
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
}))

type ExpandableCardPT = {
  expanded: boolean,
  onChange: (event: any, expanded: boolean) => any,
  renderExpandedArea: () => Node,
  renderHeader: () => Node,
  footer: Node,
  className?: string,
}

const ExpandableCardContent = (props: ExpandableCardPT) => {
  const {expanded, onChange, renderExpandedArea, renderHeader, footer, className} = props

  const classes = useStyles()

  const expansionPanelClasses = useExpansionPanelClasses()
  const summaryClasses = useSummaryClasses()
  const detailsClasses = useDetailsClasses()
  const footerClasses = useFooterClasses()

  return (
    <Grid container className={className} direction="row">
      <Paper elevation={0} className="w-100">
        <Grid item xs={12}>
          <Paper elevation={0} className={classes.mainContent}>
            {renderHeader()}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <ExpansionPanel classes={expansionPanelClasses} onChange={onChange} expanded={expanded}>
            <ExpansionPanelDetails classes={detailsClasses}>
              {renderExpandedArea()}
            </ExpansionPanelDetails>
            <ExpansionPanelSummary classes={summaryClasses}>
              <Grid container justify="center" alignItems="center" direction="row">
                <Grid item className={classes.spacing}>
                  <Typography variant="overline" color="primary" classes={footerClasses}>
                    {footer}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton color="primary">
                    <ExpandMoreIcon
                      className={cn(classes.icon, expanded && classes.iconExpanded)}
                    />
                  </IconButton>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default ExpandableCardContent
