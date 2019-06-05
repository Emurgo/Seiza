// Note(ppershing): this is development only screen
import React, {useState} from 'react'
import {OVERRIDABLE_ENV} from '../config'
import {SimpleLayout} from '@/components/visual'
import {Card} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import localStorage from '@/helpers/localStorage'

const useStyles = makeStyles({
  card: {
    padding: '20px',
  },
})

const EnvOverride = ({_key}) => {
  const lsKey = `env.${_key}`
  const value = localStorage.getItem(lsKey)
  const defaultValue = process.env[_key]
  const [val, setVal] = useState(value || '')
  const classes = useStyles()

  const onSubmit = (evt) => {
    evt.preventDefault()
    localStorage.setItem(lsKey, val)
    window.location.reload()
  }

  const onReset = (evt) => {
    evt.preventDefault()
    localStorage.removeItem(lsKey)
    window.location.reload()
  }

  return (
    <Card className={classes.card}>
      <h3>{_key}</h3>
      <div>Default: "{defaultValue}"</div>
      <div>
        <form onSubmit={onSubmit}>
          <input type="text" name={_key} value={val} onChange={(evt) => setVal(evt.target.value)} />
          <input type="submit" name="set" value="Set" />
        </form>

        <form onSubmit={onReset}>
          <input type="submit" name="reset" value="Reset to default" />
        </form>
      </div>
    </Card>
  )
}

const EnvOverrides = () => {
  return (
    <SimpleLayout maxWidth="800px">
      <h1>(Dev-only) override env settings</h1>
      {OVERRIDABLE_ENV.map((key) => (
        <EnvOverride key={key} _key={key} />
      ))}
    </SimpleLayout>
  )
}

export default EnvOverrides
