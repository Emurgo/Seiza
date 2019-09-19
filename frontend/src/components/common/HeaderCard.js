// @flow
import React from 'react'
import type {ElementRef} from 'react'
import cn from 'classnames'
import {withProps} from 'recompose'
import {
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
import {makeStyles} from '@material-ui/styles'
import {MoreVert} from '@material-ui/icons'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Card} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'

// Placed here, so that "ad-hoc/hacky" shadows related logic is in one file.
// As we apply shadow for cards in 'lg' we need to disable wrapper overflow,
// otherwise shadows would be cut off.
export const useScrollableWrapperStyles: any = makeStyles((theme) => ({
  wrapperOverflow: {
    'overflow-x': 'auto',
    [theme.breakpoints.up('lg')]: {
      'overflow-x': 'visible',
    },
  },
}))

const disabledBoxShadow = {
  'boxShadow': 'none',
  '&:hover': {
    boxShadow: 'none !important',
  },
}

const useStyles = makeStyles((theme) => ({
  defaultNonClickableCard: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  defaultNonClickableCardColor: {
    background: fade(theme.palette.background.paper, 0.75),
  },
  contentWrapper: {
    padding: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(2),
    },
  },
  card: ({disableShadow}) => {
    const shadow = disableShadow ? disabledBoxShadow : {}
    return {
      border: '0px solid transparent !important',
      display: 'flex',
      flexDirection: 'row',
      ...shadow,
      // Note: using mobile-first with box-shadow is tricky
      [theme.breakpoints.down('md')]: disabledBoxShadow,
    }
  },
  clickableCard: {
    // Note: using mobile-first with box-shadow is tricky
    [theme.breakpoints.down('md')]: disabledBoxShadow,
    [theme.breakpoints.up('lg')]: {
      '&:hover': {
        boxShadow: `0px 20px 40px 0px ${fade(theme.palette.shadowBase, 0.3)} !important`,
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
    [theme.breakpoints.up('sm')]: {
      width: 50,
      marginRight: theme.spacing(2),
      display: 'flex',
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
  primaryText: {
    paddingBottom: theme.spacing(0.5),
    whiteSpace: 'nowrap',
  },
  secondaryText: {
    lineHeight: 1.3,
  },
}))

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

type HeaderCardProps = {
  primaryText: string,
  secondaryText: string,
  icon: React$Node,
  className?: string,
  options?: Array<Option>,
  onClick?: (() => any) | null,
  classes: Object,
  clickableWrapperProps?: any,
  smallPrimaryText: boolean,
  hideShadow?: boolean,
}

// TODO: consider better naming
class _HeaderCard extends React.Component<HeaderCardProps> {
  anchorRef: {current: null | ElementRef<'div'>}
  buttonRef: {current: null | ElementRef<'button'>}

  constructor(props: HeaderCardProps) {
    super(props)
    this.anchorRef = React.createRef()
    this.buttonRef = React.createRef()
  }

  render() {
    const {
      primaryText,
      secondaryText,
      icon,
      classes,
      className,
      options,
      onClick,
      clickableWrapperProps,
      smallPrimaryText = false,
    } = this.props

    return (
      <WithModalState>
        {({isOpen, closeModal: closePopper, toggle: togglePopper}) => (
          <React.Fragment>
            <Card
              classes={{
                root: cn(classes.card, onClick && classes.clickableCard, className),
              }}
            >
              <ClickableWrapper {...{onClick, classes}} buttonBaseProps={clickableWrapperProps}>
                {/* just to center the image */}
                <Grid container wrap="nowrap" className={classes.contentWrapper}>
                  <Grid
                    container
                    direction="column"
                    justify="space-around"
                    alignItems="center"
                    className={classes.icon}
                  >
                    {icon}
                  </Grid>
                  <Grid container direction="column" justify="center">
                    <Typography
                      variant={smallPrimaryText ? 'h5' : 'h2'}
                      className={classes.primaryText}
                    >
                      {primaryText}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      className={classes.secondaryText}
                    >
                      {secondaryText}
                    </Typography>
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

const useHeaderCardContainerStyles = makeStyles(({spacing, breakpoints}) => ({
  root: {
    '& > *': {
      marginRight: spacing(0.5),
      marginLeft: spacing(0.5),
      [breakpoints.up('sm')]: {
        marginRight: spacing(1.5),
        marginLeft: spacing(1.5),
      },
    },
  },
}))

export const HeaderCardContainer = ({
  children,
  className,
}: {
  children: React$Node,
  className?: string,
}) => {
  const classes = useHeaderCardContainerStyles()
  return <div className={cn(classes.root, className)}>{children}</div>
}

const HeaderCard = (props: HeaderCardProps) => {
  const classes = useStyles(props)
  return <_HeaderCard {...props} classes={classes} />
}

type DefaultNonClickableHeaderCardProps = {|
  primaryText: string,
  secondaryText: string,
  icon: React$Node,
  className: any,
|}

const CARD_CLASSES = {}

export const DefaultNonClickableHeaderCard = ({
  primaryText,
  secondaryText,
  icon,
  className,
}: DefaultNonClickableHeaderCardProps) => {
  const classes = useStyles()

  return (
    <HeaderCardContainer className={cn(classes.defaultNonClickableCard, className)}>
      <HeaderCard
        disableShadow
        smallPrimaryText
        classes={CARD_CLASSES}
        className={cn('w-100', 'h-100', classes.defaultNonClickableCardColor)}
        {...{secondaryText, primaryText, icon}}
      />
    </HeaderCardContainer>
  )
}

export default HeaderCard
