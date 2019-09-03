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
import {mergeStylesheets} from '@/helpers/styles'
import {Card} from '@/components/visual'

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
    marginRight: theme.spacing(0.5),
  },
}))

const useExpansionPanelStyles = makeStyles((theme) => ({
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

const useSummaryStyles = makeStyles((theme) => ({
  root: {
    margin: '0 !important',
    minHeight: 'auto !important',
    borderTop: `1px solid ${theme.palette.contentUnfocus}`,
  },
  content: {
    margin: '0 !important',
    minHeight: 'auto !important',
  },
}))

const useDetailsStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },
}))

const useFooterStyles = makeStyles((theme) => ({
  root: {
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
}))

type ExpandableCardFooterProps = {
  expanded: boolean,
  label: string,
  iconClassName?: string,
}

type ExpandableCardPT = {
  expanded: boolean,
  onChange: (event: any, expanded: boolean) => any,
  renderExpandedArea: () => Node,
  renderHeader: () => Node,
  renderFooter: (expanded: boolean) => Node,
  className?: string,
  footerClasses?: Object,
}

export const ExpandableCardFooter = ({
  expanded,
  label,
  iconClassName,
}: ExpandableCardFooterProps) => {
  const classes = useStyles()
  const footerClasses = useFooterStyles()

  return (
    <Grid container justify="center" alignItems="center" direction="row">
      <Grid item className={classes.spacing}>
        <Typography variant="overline" color="primary" classes={footerClasses}>
          {label}
        </Typography>
      </Grid>
      <Grid item>
        <IconButton color="primary" className={cn(iconClassName)}>
          <ExpandMoreIcon className={cn(classes.icon, expanded && classes.iconExpanded)} />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export const ExpandableCardContent = (props: ExpandableCardPT) => {
  const {
    expanded,
    onChange,
    renderExpandedArea,
    renderHeader,
    renderFooter,
    footerClasses,
    className,
  } = props

  const classes = useStyles()

  const expansionPanelClasses = useExpansionPanelStyles()
  const summaryClasses = useSummaryStyles()
  const detailsClasses = useDetailsStyles()

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
            <ExpansionPanelSummary classes={mergeStylesheets(summaryClasses, footerClasses)}>
              {renderFooter(props.expanded)}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails classes={detailsClasses}>
              {renderExpandedArea()}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Paper>
    </Grid>
  )
}

type SimpleExpandableCardProps = {|
  expanded: boolean,
  onChange: (event: any, expanded: boolean) => any,
  renderExpandedArea: (expanded: boolean) => Node,
  renderHeader: (expanded: boolean) => Node,
  headerClasses?: {},
  detailsClasses?: {},
  hideDefaultIcon?: boolean,
|}

// TODO: could be reused for TransactionCard?
export const SimpleExpandableCard = ({
  onChange,
  expanded,
  renderHeader,
  renderExpandedArea,
  headerClasses = {},
  detailsClasses = {},
  hideDefaultIcon = false,
}: SimpleExpandableCardProps) => {
  return (
    <Card>
      <ExpansionPanel onChange={onChange} expanded={expanded}>
        <ExpansionPanelSummary
          expandIcon={hideDefaultIcon ? null : <ExpandMoreIcon color="primary" />}
          classes={headerClasses}
        >
          {renderHeader(expanded)}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={detailsClasses}>
          {renderExpandedArea(expanded)}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Card>
  )
}

const ExpandableCard = (props: ExpandableCardPT) => (
  <Card>
    <ExpandableCardContent {...props} />
  </Card>
)

export default ExpandableCard
