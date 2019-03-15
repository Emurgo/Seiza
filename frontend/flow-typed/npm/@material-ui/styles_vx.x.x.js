// @flow

// Convert CSS defitionion to classname.
// TODO(ppershing): use something better than any?
declare type _DefToClassname = (def: any) => string

// Type of produced useStyles function
declare type _HookType<T> = (args?: any) => $ObjMap<T, _DefToClassname>

declare module '@material-ui/styles' {
  // makeStyles({{class1: {...}, class2: {...}})
  // Note(ppershing): $Shape is important here
  // because otherwise an arbitrary function would match
  // against type `{[string]: any}`
  declare function makeStyles<T: $Shape<{[string]: any}>>(styles: T): _HookType<T>

  // makeStyles(theme => ({{class1: {...}, class2: {...}}))
  declare function makeStyles<T, TF: (theme: Object) => T>(styles: TF): _HookType<T>

  declare var ThemeProvider: any
}
