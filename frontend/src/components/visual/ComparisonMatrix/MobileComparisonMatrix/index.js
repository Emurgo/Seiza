// @flow

import React from 'react'
import cn from 'classnames'

import {Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

import {SimpleExpandableCard} from '@/components/visual'
import WithModalState from '@/components/headless/modalState'
import {useI18n} from '@/i18n/helpers'

import {ItemIdentifier, getHeaderBackground} from '../utils'

import type {ComparisonMatrixProps} from '../types'

const useCategoryStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(1),
  },
  pool: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  poolBorder: {
    borderBottom: `1px solid ${theme.palette.contentUnfocus}`,
  },
  header: {
    background: getHeaderBackground(theme),
  },
}))

const Category = ({getIdentifier, data, categoryConfig}) => {
  const intlFormatters = useI18n()
  const {translate: tr} = intlFormatters
  const classes = useCategoryStyles()

  return categoryConfig.map(({i18nLabel, getValue, render, height}, index) => {
    const renderExpandedArea = () => (
      <Grid container>
        {data.map((d, index, arr) => (
          <Grid
            item
            key={index}
            xs={12}
            className={cn(classes.pool, index < arr.length - 1 && classes.poolBorder)}
          >
            <Grid container justify="space-between">
              <Grid item>
                <ItemIdentifier identifier={getIdentifier(d)} title={d.name} />
              </Grid>
              <Grid item>
                {/* TODO: this logic is same in Desktop version, try to unify */}
                {render ? (
                  render(d, intlFormatters)
                ) : getValue ? (
                  <Typography style={height ? {height} : {}} variant="body1">
                    {getValue(d, intlFormatters)}
                  </Typography>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    )

    const renderHeader = () => (
      <Typography variant="overline" color="textSecondary">
        {tr(i18nLabel)}
      </Typography>
    )

    return (
      <div className={classes.wrapper} key={index}>
        <WithModalState>
          {({isOpen, toggle}) => (
            <SimpleExpandableCard
              expanded={isOpen}
              onChange={toggle}
              renderHeader={renderHeader}
              renderExpandedArea={renderExpandedArea}
              headerClasses={{root: classes.header}}
            />
          )}
        </WithModalState>
      </div>
    )
  })
}

const MobileComparisonMatrix = ({
  data,
  categoryConfigs,
  title,
  getIdentifier,
}: ComparisonMatrixProps) => {
  return (
    <Grid container direction="column">
      {categoryConfigs.map(({config, categoryLabel}, index) => (
        <Grid item key={index}>
          <Category getIdentifier={getIdentifier} data={data} categoryConfig={config} />
        </Grid>
      ))}
    </Grid>
  )
}

export default MobileComparisonMatrix
