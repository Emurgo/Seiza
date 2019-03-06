// @flow
import React from 'react'
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
  withStyles,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {withHandlers, withState} from 'recompose'
import {compose} from 'redux'

const styles = (theme) => ({
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
})

type ExpandableCardPT = {
  classes: Object,
  expanded: boolean,
  onChange: (event: any, expanded: boolean) => any,
  renderExpandedArea: () => Node,
  renderHeader: () => Node,
  footer: Node,
  className?: string,
  iconAnimating: boolean,
}

const ExpandableCard = (props: ExpandableCardPT) => {
  const {
    classes,
    expanded,
    onChange,
    renderExpandedArea,
    renderHeader,
    footer,
    className,
    iconAnimating,
  } = props

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

export default compose(
  withState('iconAnimating', 'setIconAnimating', false),
  withHandlers({
    onChange: ({setIconAnimating, iconAnimating, onChange}) => (event, expanded) => {
      setIconAnimating(!iconAnimating)
      onChange(expanded)
    },
  }),
  withStyles(styles)
)(ExpandableCard)
