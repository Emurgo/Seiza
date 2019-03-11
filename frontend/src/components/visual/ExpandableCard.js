// @flow
import React, {useState, useCallback} from 'react'
import type {Node} from 'react'
import classnames from 'classnames'
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
  expansionPanel: {
    'display': 'flex',
    'flexDirection': 'column',
    '& > :first-child': {
      order: 1,
    },
    'margin': 0,
    'borderTopRightRadius': '0 !important',
    'borderTopLeftRadius': '0 !important',
  },
  icon: {
    color: 'gray',
  },
  iconAnimationSetting: {
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
  iconAnimation: {
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

type ExpandableCardPT = {
  expanded: boolean,
  onChange: (event: any, expanded: boolean) => any,
  renderExpandedArea: () => Node,
  renderHeader: () => Node,
  footer: Node,
  className?: string,
}

const useIconAnimating = ({expanded, onChange}) => {
  const [iconAnimating, setIconAnimating] = useState(false)
  // Note(ppershing): useCallback is not an ideal solution, see
  // https://github.com/facebook/react/issues/14099
  // for a discussion
  const _onChange = useCallback(
    (event, expanded) => {
      setIconAnimating(!iconAnimating)
      onChange(event, expanded)
    },
    [iconAnimating, onChange, expanded]
  )

  return {iconAnimating, onChange: _onChange}
}

const ExpandableCard = (props: ExpandableCardPT) => {
  const {expanded, onChange: _onChange, renderExpandedArea, renderHeader, footer, className} = props

  const classes = useStyles()
  const {iconAnimating, onChange} = useIconAnimating({expanded, onChange: _onChange})

  return (
    <Grid container className={className} direction="row">
      <Grid item xs={12}>
        <Paper className={classes.mainContent}>{renderHeader()}</Paper>
      </Grid>
      <Grid item xs={12}>
        <ExpansionPanel
          classes={{
            root: classes.expansionPanel,
          }}
          onChange={onChange}
          expanded={expanded}
        >
          <ExpansionPanelDetails>{renderExpandedArea()}</ExpansionPanelDetails>
          <ExpansionPanelSummary>
            <Grid container justify="center" alignItems="center" direction="row">
              <Grid item className={classes.spacing}>
                <Typography>{footer}</Typography>
              </Grid>
              <Grid item>
                <IconButton>
                  <ExpandMoreIcon
                    className={classnames(
                      classes.icon,
                      classes.iconAnimationSetting,
                      iconAnimating && classes.iconAnimation
                    )}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </Grid>
    </Grid>
  )
}

export default ExpandableCard
