export default function transformer(file, api) {
  const j = api.jscodeshift

  return j(file.source)
    .find(j.Identifier)
    .forEach((path) => {
      if (path.value.name !== 'defineMessages') return
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
    })
    .toSource()
}
