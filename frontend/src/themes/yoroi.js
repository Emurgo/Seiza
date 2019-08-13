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
    gradient: 'linear-gradient(97deg, #C5D9F5 0%, #CAF2ED 100%)',
    buttons: {
      getContainedGradient: (degree = 90) => ({
        background: `linear-gradient(${degree}deg, #3154CB 0%, #17D1AA 100%)`,
        hover: `linear-gradient(${degree}deg, #17D1AA 0%,  #17D1AA 100%)`,
        textColor: '#FFFFFF',
        textHover: '#FFFFFF',
      }),
      getOutlinedGradient: (degree = 90) => ({
        background: `linear-gradient(${degree}deg, #3154CB 0%, #17D1AA 100%)`,
        hover: `linear-gradient(${degree}deg, #17D1AA 0%,  #17D1AA 100%)`,
        textColor: '#3E60CD',
        textHover: '#17D1AA',
      }),
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
      main: '#3E60CD',
    },
    secondary: {
      main: '#17D1AA',
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
      background: '#2845B5',
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
      tooltip: '#F4F5FC',
    },
    contentFocus: '#6F7290',
    contentUnfocus: '#BFC5D2',
    unobtrusiveContentHighlight: '#F4F6FC',
    contentDividerWeak: '#E6EAF1', // TODO: change color for this theme
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
