// @flow
import React from 'react'
import type {ElementRef} from 'react'
import classnames from 'classnames'
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
} from '@material-ui/core'
import {ArrowDropDown} from '@material-ui/icons'

import WithModalState from '@/components/headless/modalState'
import IconEpoch from '@/tmp_assets/MetricsCard-icon-epoch.png'
import IconBlocks from '@/tmp_assets/MetricsCard-icon-blocks.png'
import IconDecentralization from '@/tmp_assets/MetricsCard-icon-decentralization.png'
import IconPrice from '@/tmp_assets/MetricsCard-icon-price.png'
import IconPools from '@/tmp_assets/MetricsCard-icon-pools.png'

const styles = (theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'row',
      padding: '5px',
      boxShadow: 'none',
    },
    dropdownArrow: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    value: {
      fontSize: 20,
    },
    metric: {
      color: 'grey',
    },
    bottomSpace: {
      height: '5px',
    },
    popper: {
      minWidth: '150px',
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
}
const DropdownList = ({options, isOpen, anchorEl, close, className}: DropdownListProps) => (
  <Popper open={isOpen} anchorEl={anchorEl} transition placement="bottom-end">
    {({TransitionProps}) => (
      <Grow {...TransitionProps}>
        <Paper className={className}>
          <ClickAwayListener onClickAway={close}>
            <MenuList>
              {options.map(({label, onClick}) => (
                <MenuItem key={label} onClick={onClick}>
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Grow>
    )}
  </Popper>
)

type MetricsCardProps = {
  metric: string,
  value: string,
  icon: $Keys<typeof ICONS>,
  className: any,
  options: ?Array<Option>,
  onClick: ?() => any,
  classes: Object,
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
    const {metric, value, icon, classes, className, options, onClick} = this.props

    return (
      <WithModalState>
        {({isOpen, closeModal: closePopper, toggle: togglePopper}) => (
          <React.Fragment>
            <Card className={classnames(classes.card, className)}>
              <img alt="" src={ICONS[icon]} />
              <Grid container direction="column" justify="center" alignItems="center">
                <Grid item>
                  <div className={classes.value}>{value}</div>
                </Grid>
                <Grid item>
                  <div className={classes.metric}>{metric}</div>
                </Grid>
              </Grid>
              {options && (
                <div className={classes.dropdownArrow}>
                  <IconButton
                    onClick={(event) => {
                      options && togglePopper()
                      onClick && onClick()
                    }}
                    buttonRef={this.buttonRef}
                  >
                    <ArrowDropDown />
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
