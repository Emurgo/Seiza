import common from './common'
import _ from 'lodash'

const theme = _.merge({}, common, {
  palette: {
    type: 'dark',
    gradient: 'linear-gradient(97deg, #5a25be 0%, #9bb8e7 100%)',
    buttons: {
      // Note(bigamasta): do we really need 97 or can we have also 90?
      getContainedGradient: (degree = 90) => ({
        background: `linear-gradient(${degree + 7}deg, #715BD3 0%, #95BAF7 100%)`,
        hover: `linear-gradient(${degree}deg, #95BAF7 0%,  #95BAF7 100%)`,
        textColor: '#FFFFFF',
        textHover: '#FFFFFF',
      }),
      getOutlinedGradient: (degree = 97) => ({
        background: `linear-gradient(${degree}deg, #715BD3 0%, #95BAF7 100%)`,
        hover: `linear-gradient(${degree}deg, #95BAF7 0%,  #95BAF7 100%)`,
        textColor: '#90ACFE',
        textHover: '#95BAF7',
      }),
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    primary: {
      main: '#90ACFE',
    },
    secondary: {
      main: 'rgb(21, 51, 99, 0.3)',
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
      background: '#220049',
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
      default: '#180d48',
      paper: 'rgba(146, 185, 252, 0.1)',
      paperContrast: 'rgb(18, 5, 70)',
      tooltip: '#180d48',
    },
    contentFocus: '#6F7290',
    contentUnfocus: '#BFC5D2',
    unobtrusiveContentHighlight: '#6F5B93',
    disabled: 'rgba(146, 185, 252, 0.05)',
    adaValue: {
      positive: '#5FDBC1',
      negative: '#FF1755',
      neutral: '#ffffff',
    },
    shadowBase: '#412596',
  },
})

export default theme
