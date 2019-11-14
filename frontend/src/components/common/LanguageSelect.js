// @flow
import React from 'react'
import cn from 'classnames'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {useLocale} from '@/components/context/intl'
import {Select} from '@/components/visual'
import {NavbarLink} from '@/components/common/Navbar'
import config from '@/config'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    cursor: 'pointer',
  },
  mobileWrapper: {
    paddingTop: theme.spacing(0.625),
    paddingBottom: theme.spacing(0.625),
  },
}))

const Label = ({
  langCode,
  flagSrc,
  mobile,
}: {
  langCode: string,
  flagSrc: string,
  mobile?: boolean,
}) => {
  const classes = useStyles()
  const imgSize = mobile ? 34 : 24
  return (
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="center"
      wrap="nowrap"
      className={cn(classes.wrapper, mobile && classes.mobileWrapper)}
    >
      <img alt="" width={imgSize} height={imgSize} src={flagSrc} />
      <NavbarLink>{langCode}</NavbarLink>
    </Grid>
  )
}

// Helper to conditional inclusion
const insertIf = (cond, value) => (cond ? [value] : [])

export const LANGUAGES = [
  {
    locale: 'en',
    label: <Label langCode="EN" flagSrc="/static/assets/icons/flags/english.svg" />,
    mobileLabel: <Label langCode="EN" flagSrc="/static/assets/icons/flags/english.svg" mobile />,
  },
  {
    locale: 'ja',
    label: <Label langCode="JA" flagSrc="/static/assets/icons/flags/japanese.svg" />,
    mobileLabel: <Label langCode="JA" flagSrc="/static/assets/icons/flags/japanese.svg" mobile />,
  },
  ...insertIf(config.featureEnableRussian, {
    locale: 'ru',
    label: <Label langCode="RU" flagSrc="/static/assets/icons/flags/russian.svg" />,
    mobileLabel: <Label langCode="RU" flagSrc="/static/assets/icons/flags/russian.svg" mobile />,
  }),
  ...insertIf(config.featureEnableSpanish, {
    locale: 'es',
    label: <Label langCode="ES" flagSrc="/static/assets/icons/flags/spanish.svg" />,
    mobileLabel: <Label langCode="ES" flagSrc="/static/assets/icons/flags/spanish.svg" mobile />,
  }),
  /*
  {
    locale: 'cn',
    label: <Label langCode="CN" flagSrc="/static/assets/icons/flags/chinese.svg" />,
  },
  {
    locale: 'kr',
    label: <Label langCode="KR" flagSrc="/static/assets/icons/flags/korean.svg" />,
  },*/
].map<{value: string, label: React$Node, mobileLabel: React$Node}>(
  ({locale, label, mobileLabel}) => ({value: locale, label, mobileLabel})
)

// TODO: refactor using useLocale() hook
export default () => {
  const {locale, setLocale} = useLocale()
  return (
    <Select
      hasBorder={false}
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      options={LANGUAGES}
    />
  )
}

export const MobileLanguage = () => {
  const {setLocale} = useLocale()
  return (
    <Grid container justify="space-between">
      {LANGUAGES.map(({mobileLabel, value}) => (
        <Grid item key={value} onClick={(e) => setLocale(value)}>
          {mobileLabel}
        </Grid>
      ))}
    </Grid>
  )
}
