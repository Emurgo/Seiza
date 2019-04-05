// @flow
import React from 'react'
import {
  Table as MuiTable,
  TableBody,
  TableHead,
  TableRow as TR,
  TableCell as TD,
  Typography,
  Grid,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {darken} from '@material-ui/core/styles/colorManipulator'
import {defineMessages} from 'react-intl'

import {Card} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import Overlay from './Overlay'
import LoadingOverlay from './LoadingOverlay'
import ErrorOverlay from './ErrorOverlay'

const messages = defineMessages({
  noData: 'No data to show.',
})

const useTableStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
    '&:hover': {
      backgroundColor: darken(theme.palette.background.default, 0.07),
    },
  },
  cell: {
    // Not sure why MaterialUi has in-consistent padding
    // Reset paddingRight to same value as paddingLeft
    paddingRight: '24px',
  },
  head: {
    textTransform: 'uppercase',
  },
}))

type TableProps = {|
  headerData: Array<Object>,
  bodyData: Array<Object>,
  noDataText?: string,
  loading: boolean,
  error: any,
|}

const Table = ({headerData, bodyData, noDataText, loading, error}: TableProps) => {
  const classes = useTableStyles()
  const {translate: tr} = useI18n()
  const _noDataText = noDataText || tr(messages.noData)

  return (
    <Card classes={{root: classes.root}}>
      <Overlay.Wrapper>
        <MuiTable>
          <TableHead className={classes.head}>
            <TR>
              {headerData.map((item, index) => (
                <TD key={index} align="left" className={classes.cell}>
                  {item}
                </TD>
              ))}
            </TR>
          </TableHead>
          <TableBody>
            {bodyData.length ? (
              bodyData.map((row, outerIndex) => (
                <TR key={outerIndex} className={classes.row}>
                  {row.map((item, innerIndex) => (
                    <TD key={innerIndex} align="left" className={classes.cell}>
                      {item}
                    </TD>
                  ))}
                </TR>
              ))
            ) : (
              <React.Fragment>
                <TR>
                  <TD colSpan={headerData.length} rowSpan={2}>
                    {!loading && (
                      <Grid container justify="space-around" direction="row">
                        <Typography variant="caption">{_noDataText}</Typography>
                      </Grid>
                    )}
                  </TD>
                </TR>
                <TR />
              </React.Fragment>
            )}
          </TableBody>
        </MuiTable>
        <LoadingOverlay loading={loading} />
        <ErrorOverlay error={error} />
      </Overlay.Wrapper>
    </Card>
  )
}

export default Table
