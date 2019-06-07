import common from './common'
import _ from 'lodash'

const theme = _.merge({}, common, {
  palette: {
    type: 'dark',
    gradient: 'linear-gradient(97deg, #8673EC 0%, #99B0EA 100%)',
    buttonsGradient: {
      direction: 97,
      start: '#715BD3',
      end: '#95BAF7',
      startPercent: 0,
      endPercent: 100,
      gradient: 'linear-gradient(97deg, #715BD3 0%, #95BAF7 100%)',
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
      default: '#34005A',
      paper: '#3D1769',
      paperContrast: '#220049',
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

