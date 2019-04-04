import cn from 'classnames'

export const mergeStylesheets = (...classesArrays) => {
  return classesArrays.reduce((acc, classesObj = {}) => {
    Object.keys(classesObj).forEach((className) => {
      acc[className] = cn(acc[className], classesObj[className])
    })
    return acc
  }, {})
}
