import common from './common'
import _ from 'lodash'

const theme = _.merge({}, common, {
  overrides: {
    MuiTouchRipple: {
      root: {
        color: 'rgba(77, 32, 192, 0.4)',
      },
    },
  },
  palette: {
    action: {
      hover: '#F4F6FC',
    },
    gradient: 'linear-gradient(97deg, #BFADE7 0%, #E0F1F8 100%)',
    buttons: {
      primary: {
        textColor: '#FFFFFF',
        textHover: '#FFFFFF',
      },
      secondary: {
        textColor: '#FFFFFF',
        textHover: '#FFFFFF',
      },
      primaryGradient: {
        background: 'linear-gradient(90deg, #4D20C0 0%,  #92A7FC 67%, #B1E1F2 100%)',
        hover: 'linear-gradient(90deg, #4D20C0 0%,  #4D20C0 100%)',
        textColor: '#FFFFFF',
        textHover: '#FFFFFF',
      },
      secondaryGradient: {
        background: 'linear-gradient(90deg, #4D20C0 0%,  #92A7FC 67%, #B1E1F2 100%)',
        hover: 'linear-gradient(90deg, #4D20C0 0%,  #4D20C0 100%)',
        textColor: '#4D20C0',
        textHover: '#4D20C0',
      },
      tertiaryGradient: {
        background: 'linear-gradient(45deg, #4D20C0 0%,  #B1E1F2 100%)',
        hover: 'linear-gradient(45deg, #4D20C0 0%,  #4D20C0 100%)',
        textColor: '#FFFFFF',
        textHover: '#FFFFFF',
      },
    },
    // Note:
    // <Typography color="primary"> ---> selects palette.primary.main
    // <Typography color="secondary"> ---> selects palette.secondary.main
    // <Typography color="textPrimary"> ---> selects palette.text.primary
    // <Typography color="textSecondary"> ---> selects palette.text.secondary
    text: {
      primary: '#120546',
      secondary: '#6F7290',
    },
    primary: {
      main: '#4D20C0',
    },
    secondary: {
      main: '#4D20C0',
    },
    tertiary: {
      main: '#92B9FC', // underscore of navbar, icons have it
    },
    quaternary: {
      main: '#B1E1F2', // color of one of lines in graph
    },
    footer: {
      link: '#6F7290',
      contrastText: '#FFFFFF',
      background: '#120546',
    },
    warning: {
      color: '#FF805D',
      background: '#FFE2DA',
    },
    alertWeak: '#F9D8E6', // TODO: confirm with Marta
    alertStrong: {
      color: '#FF1755',
      background: '#F9E9F2',
    },
    emphasis: {
      color: '#8AE8D4',
      background: '#EAF8F9',
    },
    noResults: {
      color: '#C9BEF1',
      background: '#CEC0F2',
    },
    background: {
      paperContrast: '#F4F5FC',
      paper: '#FFFFFF',
      default: '#F9FAFF',
      tooltip: '#F9FAFF',
    },
    contentFocus: '#6F7290',
    contentUnfocus: '#BFC5D2',
    unobtrusiveContentHighlight: '#F4F6FC',
    disabled: 'rgba(146, 185, 252, 0.05)',
    adaValue: {
      positive: '#5FDBC1',
      negative: '#FF1755',
      neutral: '#120546',
    },
    shadowBase: '#412596',
  },
})

export default theme
