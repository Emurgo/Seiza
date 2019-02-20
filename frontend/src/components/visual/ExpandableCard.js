// @flow
import React from 'react'
import type {Node} from 'react'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Paper,
  Typography,
  Grid,
  withStyles,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {withHandlers} from 'recompose'
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
  // TODO: animation for flipping icon upside down when expanding
  icon: {
    color: 'gray',
  },
  mainContent: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
})

type ExpandableCardPT = {
  classes: Object,
  expanded: boolean,
  onChange: (event: any, expanded: boolean) => any,
  renderExpandedArea: () => Node,
  renderHeader: () => Node,
  footer: Node,
}

const ExpandableCard = (props: ExpandableCardPT) => {
  const {classes, expanded, onChange, renderExpandedArea, renderHeader, footer} = props
  return (
    <Grid container>
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
            <Grid container justify="center" alignItems="center">
              <Grid item>
                <Typography>{footer}</Typography>
              </Grid>
              <Grid item>
                <ExpandMoreIcon className={classes.icon} />
              </Grid>
            </Grid>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </Grid>
    </Grid>
  )
}

export default compose(
  withHandlers({
    onChange: (props) => (event, expanded) => props.onChange(expanded),
  }),
  withStyles(styles)
)(ExpandableCard)
