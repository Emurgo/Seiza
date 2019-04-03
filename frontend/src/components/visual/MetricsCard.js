// @flow
import React from 'react'
import type {ElementRef} from 'react'
import classnames from 'classnames'
import {withProps} from 'recompose'
import {
  Card,
  withStyles,
  createStyles,
  MenuList,
  MenuItem,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  Grid,
  IconButton,
  ButtonBase,
  Typography,
} from '@material-ui/core'
import {fade} from '@material-ui/core/styles/colorManipulator'
import {MoreVert} from '@material-ui/icons'

import WithModalState from '@/components/headless/modalState'
import IconEpoch from '@/assets/icons/metrics-epoch.svg'
import IconBlocks from '@/assets/icons/metrics-blocks.svg'
import IconDecentralization from '@/assets/icons/metrics-decentralization.svg'
import IconPrice from '@/assets/icons/metrics-currency.svg'
import IconPools from '@/assets/icons/metrics-stakepools.svg'

const styles = (theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'row',
      boxShadow: 'none',
    },
    dropdownArrow: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 50,
      marginRight: theme.spacing.unit,
      marginLeft: theme.spacing.unit,
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
      'border': '1px solid transparent',
      'borderRadius': '4px',
      'transition': theme.transitions.create(['background-color', 'box-shadow', 'border'], {
        duration: theme.transitions.duration.short,
      }),
      '&:hover': {
        'backgroundColor': fade(theme.palette.action.active, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
        'border': `1px solid ${theme.palette.text.primary}`,
      },
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
        <Paper className={className}>
          <ClickAwayListener onClickAway={close}>
            <MenuList>
              {options.map(({label, onClick}) => (
                <MenuItem key={label} onClick={buildOnClickHandler(onClick)}>
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
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
  onClick?: () => any,
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
            <Card className={classnames(classes.card, className)}>
              <ClickableWrapper {...{onClick, classes}} buttonBaseProps={clickableWrapperProps}>
                {/* just to center the image */}
                <Grid container direction="column" justify="space-around" className={classes.icon}>
                  <img alt="" src={ICONS[icon]} />
                </Grid>
                <Grid container direction="column" justify="center" alignItems="center" item>
                  <Grid item>
                    <Typography variant="h2" className={classes.value}>
                      {value}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" color="textSecondary" className={classes.metric}>
                      {metric}
                    </Typography>
                  </Grid>
                </Grid>
              </ClickableWrapper>
              {options && (
                <div className={classes.dropdownArrow}>
                  <IconButton
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
