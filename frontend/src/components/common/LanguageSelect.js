// @flow
import React from 'react'
import {Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {withSetLocale} from '@/components/HOC/intl'
import {Select} from '@/components/visual'
import {NavTypography} from '@/components/visual/Navbar'

import EnglishFlag from '@/assets/icons/flags/english.svg'
import JapaneseFlag from '@/assets/icons/flags/japanese.svg'
import RussianFlag from '@/assets/icons/flags/russian.svg'
import ChineseFlag from '@/assets/icons/flags/chinese.svg'
import KoreanFlag from '@/assets/icons/flags/korean.svg'

const useStyles = makeStyles((theme) => ({
  select: {
    width: '90px',
  },
}))

const Label = ({langCode, flagSrc}) => (
  <Grid container direction="row" justify="space-around" alignItems="center" wrap="nowrap">
    <img alt="" src={flagSrc} />
    <NavTypography>{langCode}</NavTypography>
  </Grid>
)

const LANGUAGES = [
  {
    locale: 'en',
    label: <Label langCode="EN" flagSrc={EnglishFlag} />,
  },
  {
    locale: 'ja',
    label: <Label langCode="JA" flagSrc={JapaneseFlag} />,
  },
  {
    locale: 'ru',
    label: <Label langCode="RU" flagSrc={RussianFlag} />,
  },
  {
    locale: 'cn',
    label: <Label langCode="CN" flagSrc={ChineseFlag} />,
  },
  {
    locale: 'kr',
    label: <Label langCode="KR" flagSrc={KoreanFlag} />,
  },
].map(({locale, label}) => ({value: locale, label}))

// TODO: use images instead of names
export default withSetLocale(({setLocale, locale}) => {
  const classes = useStyles()
  return (
    <Select
      hasBorder={false}
      className={classes.select}
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      options={LANGUAGES}
    />
  )
})
