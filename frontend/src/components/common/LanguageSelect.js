// @flow
import React from 'react'
import cn from 'classnames'
import {Grid, withStyles} from '@material-ui/core'
import {withSetLocale} from '@/components/HOC/intl'
import {Select} from '@/components/visual'
import {NavTypography} from '@/components/visual/Navbar'

import EnglishFlag from '@/assets/icons/flags/english.svg'
import JapaneseFlag from '@/assets/icons/flags/japanese.svg'
import RussianFlag from '@/assets/icons/flags/russian.svg'
// import ChineseFlag from '@/assets/icons/flags/chinese.svg'
// import KoreanFlag from '@/assets/icons/flags/korean.svg'
import config from '@/config'

const styles = (theme) => ({
  wrapper: {
    cursor: 'pointer',
  },
  mobileWrapper: {
    paddingTop: theme.spacing.unit * 0.625,
    paddingBottom: theme.spacing.unit * 0.625,
  },
})

const Label = withStyles(styles)(({langCode, flagSrc, mobile, classes}) => {
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
      <NavTypography>{langCode}</NavTypography>
    </Grid>
  )
})

// Helper to conditional inclusion
const insertIf = (cond, value) => cond ? [value] : []

const LANGUAGES = [
  {
    locale: 'en',
    label: <Label langCode="EN" flagSrc={EnglishFlag} />,
    mobileLabel: <Label langCode="EN" flagSrc={EnglishFlag} mobile />,
  },
  {
    locale: 'ja',
    label: <Label langCode="JA" flagSrc={JapaneseFlag} />,
    mobileLabel: <Label langCode="JA" flagSrc={JapaneseFlag} mobile />,
  },
  ...insertIf(config.featureEnableRussian,
    {
      locale: 'ru',
      label: <Label langCode="RU" flagSrc={RussianFlag} />,
      mobileLabel: <Label langCode="RU" flagSrc={RussianFlag} mobile />,
    }),
  ...insertIf(config.featureEnableSpanish,
    {
      locale: 'es',
      label: <Label langCode="ES" flagSrc={RussianFlag} />,
      mobileLabel: <Label langCode="ES" flagSrc={RussianFlag} mobile />,
    }),
  /*
  {
    locale: 'cn',
    label: <Label langCode="CN" flagSrc={ChineseFlag} />,
  },
  {
    locale: 'kr',
    label: <Label langCode="KR" flagSrc={KoreanFlag} />,
  },*/
].map(({locale, label, mobileLabel}) => ({value: locale, label, mobileLabel}))

export default withSetLocale(({setLocale, locale}) => (
  <Select
    hasBorder={false}
    value={locale}
    onChange={(e) => setLocale(e.target.value)}
    options={LANGUAGES}
  />
))

export const MobileLanguage = withSetLocale(({setLocale, locale}) => (
  <Grid container justify="space-between">
    {LANGUAGES.map(({mobileLabel, value}) => (
      <Grid item key={value} onClick={(e) => setLocale(value)}>
        {mobileLabel}
      </Grid>
    ))}
  </Grid>
))
