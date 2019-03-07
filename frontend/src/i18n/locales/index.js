//@flow

//$FlowFixMe fix json imports
import en from './en.json'
import _ from 'lodash'

// "Translates" a string or a function returning string
// into random characters from targetChars
const dummyTranslate = (targetChars: string) => (msg: string): string => {
  // Note: This function deals only heuristically with
  // intl format. We don't want DSL parser as this is only
  // a temporary hack

  // Example we need to handle correctly:
  // "{count, plural, =0 {confirmations} one {confirmation} other {confirmations}}"
  //
  let result = ''
  let nesting = 0

  const nestingDelta = (c) => {
    switch (c) {
      case '{':
        return 1
      case '}':
        return -1
      default:
        return 0
    }
  }

  for (const c of msg) {
    nesting += nestingDelta(c)

    // this is inside intl control sequence
    if (nesting % 2 !== 0) {
      result += c
      break
    }

    // Random choice
    const target = targetChars[Math.floor(targetChars.length * Math.random())]

    result += c.replace(/[a-zA-Z]/, target)
  }
  return result
}

const ja = _.mapValues(en, dummyTranslate('インポートしようとしたウ'))
const ru = _.mapValues(en, dummyTranslate('абвгдеёжзийклмнопрстуфхцчшщъыьэюя'))

export default {en, ja, ru}
