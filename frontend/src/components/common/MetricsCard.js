// @flow
import React from 'react'
import type {ElementRef} from 'react'
import classnames from 'classnames'
import {withProps} from 'recompose'
import {
  withStyles,
  createStyles,
  MenuList,
  MenuItem,
  Popper,
  Grow,
  ClickAwayListener,
  Grid,
  IconButton,
  ButtonBase,
  Typography,
} from '@material-ui/core'
import {MoreVert} from '@material-ui/icons'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Card} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import IconEpoch from '@/static/assets/icons/metrics-epoch.svg'
import IconBlocks from '@/static/assets/icons/metrics-blocks.svg'
import IconDecentralization from '@/static/assets/icons/metrics-decentralization.svg'
import IconPrice from '@/static/assets/icons/metrics-currency.svg'
import IconPools from '@/static/assets/icons/metrics-stakepools.svg'

const styles = (theme) =>
  createStyles({
    contentWrapper: {
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      [theme.breakpoints.up('md')]: {
        paddingLeft: theme.spacing(2),
      },
    },
    card: {
      border: '0px solid transparent !important',
      display: 'flex',
      flexDirection: 'row',
      // Note: special case when not using mobile-first
      [theme.breakpoints.down('md')]: {
        'boxShadow': 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
    clickableCard: {
      '&:hover': {
        boxShadow: `0px 7px 7px 0px ${fade(theme.palette.shadowBase, 0.2)} !important`,
        [theme.breakpoints.up('sm')]: {
          boxShadow: `0px 20px 30px 0px ${fade(theme.palette.shadowBase, 0.3)} !important`,
        },
      },
    },
    dropdownArrow: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      display: 'none',
      [theme.breakpoints.up('lg')]: {
        width: 50,
        marginRight: theme.spacing(2),
        display: 'block',
      },
    },
    optionsIcon: {
      'color': theme.palette.contentUnfocus,
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    bottomSpace: {
      height: '5px',
    },
    popper: {
      minWidth: '150px',
    },
    noButton: {
      padding: '4px',
      width: '100%',
      display: 'flex',
    },
    button: {
      'padding': '4px',
      'width': '100%',
      'display': 'flex',
      'borderRadius': '4px',
      'transition': theme.transitions.create(['background-color', 'box-shadow'], {
        duration: theme.transitions.duration.short,
      }),
      '&:hover': {
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    },
    value: {
      paddingBottom: theme.spacing(0.5),
    },
  })

const ICONS = {
  epoch: IconEpoch,
  blocks: IconBlocks,
  decentralization: IconDecentralization,
  price: IconPrice,
  pools: IconPools,
}

type Option = {
  label: string,
  onClick: () => any,
}
type DropdownListProps = {
  className: string,
  anchorEl: any,
  options: Array<Option>,
  isOpen: boolean,
  close: (event: any) => any,
  buildOnClickHandler: (onClick: () => any) => any,
}
const DropdownList = withProps(({close}) => ({
  buildOnClickHandler: (onClick) => (...args) => {
    close(...args)
    onClick(...args)
  },
}))(({options, isOpen, anchorEl, close, buildOnClickHandler, className}: DropdownListProps) => (
  <Popper open={isOpen} anchorEl={anchorEl} transition placement="bottom-end">
    {({TransitionProps}) => (
      <Grow {...TransitionProps}>
        <Card classes={{root: className}}>
          <ClickAwayListener onClickAway={close}>
            <MenuList>
              {options.map(({label, onClick}, idx) => (
                /* Note: `label` can be element */
                <MenuItem key={idx} onClick={buildOnClickHandler(onClick)}>
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Card>
      </Grow>
    )}
  </Popper>
))

const ClickableWrapper = ({onClick, classes, children, buttonBaseProps}) =>
  onClick ? (
    <ButtonBase onClick={onClick} className={classes.button} focusRipple {...buttonBaseProps}>
      {children}
    </ButtonBase>
  ) : (
    <div className={classes.noButton}>{children}</div>
  )

type MetricsCardProps = {
  metric: string,
  value: string,
  icon: $Keys<typeof ICONS>,
  className: any,
  options?: Array<Option>,
  onClick?: (() => any) | null,
  classes: Object,
  clickableWrapperProps?: any,
}

class MetricsCard extends React.Component<MetricsCardProps> {
  anchorRef: {current: null | ElementRef<'div'>}
  buttonRef: {current: null | ElementRef<'button'>}

  constructor(props) {
    super(props)
    this.anchorRef = React.createRef()
    this.buttonRef = React.createRef()
  }

  render() {
    const {
      metric,
      value,
      icon,
      classes,
      className,
      options,
      onClick,
      clickableWrapperProps,
    } = this.props

    return (
      <WithModalState>
        {({isOpen, closeModal: closePopper, toggle: togglePopper}) => (
          <React.Fragment>
            <Card
              classes={{
                root: classnames(classes.card, onClick && classes.clickableCard, className),
              }}
            >
              <ClickableWrapper {...{onClick, classes}} buttonBaseProps={clickableWrapperProps}>
                {/* just to center the image */}
                <Grid container wrap="nowrap" className={classes.contentWrapper}>
                  <Grid
                    container
                    direction="column"
                    justify="space-around"
                    className={classes.icon}
                  >
                    <img alt="" src={ICONS[icon]} />
                  </Grid>
                  <Grid container direction="column" justify="center">
                    <Grid item>
                      <Typography variant="h3" className={classes.value}>
                        {value}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        className={classes.metric}
                      >
                        {metric}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </ClickableWrapper>
              {options && (
                <div className={classes.dropdownArrow}>
                  <IconButton
                    color="primary"
                    className={classes.optionsIcon}
                    onClick={(event) => {
                      options && togglePopper()
                    }}
                    buttonRef={this.buttonRef}
                  >
                    <MoreVert />
                  </IconButton>
                </div>
              )}
            </Card>
            <div ref={this.anchorRef} className={classes.bottomSpace}>
              {options && (
                <DropdownList
                  className={classes.popper}
                  anchorEl={this.anchorRef.current}
                  options={options}
                  isOpen={isOpen}
                  close={(event) =>
                    this.buttonRef.current &&
                    !this.buttonRef.current.contains(event.target) &&
                    closePopper()
                  }
                />
              )}
            </div>
          </React.Fragment>
        )}
      </WithModalState>
    )
  }
}
export default withStyles(styles)(MetricsCard)
