import dayjs from 'dayjs-ext'

import timeZonePlugin from 'dayjs-ext/plugin/timeZone-2012-2022'
import localizableFormat from 'dayjs-ext/plugin/localizableFormat'

import 'dayjs-ext/locale/ja'
import 'dayjs-ext/locale/ru'

// NOTE!!!: order of plugin matter, timeZone must be after localizableFormat
dayjs.extend(localizableFormat).extend(timeZonePlugin)

export default dayjs
