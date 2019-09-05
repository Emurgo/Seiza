// @flow

import React, {useMemo} from 'react'
import {makeStyles} from '@material-ui/styles'
import {DeviceHub as SelectIcon} from '@material-ui/icons'

import {Select} from '@/components/visual'
import {Link} from '@/components/common'
import {NavbarLink} from '@/components/common/Navbar'
import {useUrlInfo} from '@/components/context/urlInfo'

import {blockchainNetworks, getBlockchainNetworkUrlWithQuery} from '@/helpers/testnet'
import {useLocale} from '@/components/context/intl'

const useStyles = makeStyles((theme) => ({
  openIcon: {
    'color': theme.palette.contentUnfocus,
    'display': 'flex',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  link: {
    textDecoration: 'none',
  },
}))

const ON_CHANGE = () => null

const SelectIconWrapper = () => {
  const classes = useStyles()
  return (
    <div className={classes.openIcon}>
      <SelectIcon fontSize="small" />
    </div>
  )
}

const BlockchainNetworkSelect = () => {
  const classes = useStyles()
  const {origin} = useUrlInfo()
  const {locale} = useLocale()

  const value = useMemo(() => getBlockchainNetworkUrlWithQuery(origin, locale), [locale, origin])

  const options = useMemo(
    () =>
      blockchainNetworks.map((network) => {
        const link = getBlockchainNetworkUrlWithQuery(network.url, locale)
        return {
          value: link,
          label: (
            <Link underline="none" external to={link} target="_blank">
              <NavbarLink className={classes.link}>{network.label}</NavbarLink>
            </Link>
          ),
        }
      }),
    [classes.link, locale]
  )

  return (
    <Select
      renderValue={SelectIconWrapper}
      hasBorder={false}
      value={value}
      onChange={ON_CHANGE}
      options={options}
    />
  )
}

export default BlockchainNetworkSelect
