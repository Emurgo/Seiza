export default function transformer(file, api) {
  const j = api.jscodeshift

  const transformDefineMessages = (path) => {
    if (!path.parent.value.arguments) return
    j(path.parent.value.arguments[0])
      .find(j.ObjectExpression)
      .forEach((path) => {
        let content = '"?????"'
        j(path)
          .find(j.Identifier)
          .forEach((p) => {
            if (p.value.name !== 'defaultMessage') return
            content = p.parent.value.value.value
          })

        j(path).replaceWith((p) => j.literal(content))
      })
  }

  const root = j(file.source)

  root.find(j.Identifier).forEach((path) => {
    if (path.value.name === 'defineMessages') transformDefineMessages(path)
  })

  const toDelete = new Set()
  root.find(j.Identifier).forEach((path) => {
    if (path.value.name === 'I18N_PREFIX') toDelete.add(path.parent.parent)
  })
  toDelete.forEach((path) => j(path).remove())

  return root.toSource()
}
