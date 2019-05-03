// @flow
import React from 'react'
import _ from 'lodash'
import {
  Table as MuiTable,
  TableBody,
  TableHead,
  TableRow as TR,
  TableCell as TD,
  Typography,
  Grid,
  Hidden,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import cn from 'classnames'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Card, KeyValueCard} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import Overlay from './Overlay'
import LoadingOverlay from './LoadingOverlay'
import ErrorOverlay from './ErrorOverlay'

const messages = defineMessages({
  noData: 'No data to show.',
})

const useTableStyles = makeStyles(({hover, palette}) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  row: {
    '&:nth-child(odd)': {
      backgroundColor: fade(palette.primary.main, 0.03),
    },
  },
  hoverableRow: {
    'transition': hover.transitionOut(['box-shadow']),
    '&:hover': {
      marginTop: '-1px',
      borderTop: `1px solid ${palette.unobtrusiveContentHighlight}`,
      borderRadius: '3px',
      boxShadow: `0px 10px 30px ${fade(palette.text.primary, 0.11)}`,
      transition: hover.transitionIn(['box-shadow']),
    },
  },
  cell: {
    // Not sure why MaterialUi has in-consistent padding
    // Reset paddingRight to same value as paddingLeft
    paddingRight: '24px',
  },
  bodyCell: {
    border: 'none',
  },
  head: {
    textTransform: 'uppercase',
  },
}))

type TableProps = {|
  headerData: Array<Object>,
  bodyData: Array<Object>,
  fieldsConfig?: Array<{|
    align?: string,
    thAlign?: string,
  |}>,
  noDataText?: string,
  loading: boolean,
  error: any,
  hoverable?: boolean,
|}

const getAlignment = (fieldsConfig, index) => (fieldsConfig ? fieldsConfig[index].align : 'left')

const getThAlignment = (fieldsConfig, index) =>
  fieldsConfig ? fieldsConfig[index].thAlign || fieldsConfig[index].align : 'left'

const NormalTable = ({
  headerData,
  bodyData,
  noDataText,
  loading,
  error,
  fieldsConfig,
  hoverable = false,
}: TableProps) => {
  const classes = useTableStyles()
  const {translate: tr} = useI18n()
  const _noDataText = noDataText || tr(messages.noData)

  // TODO: We could have different config/data structure, but I would suggest to refactor that
  // when we have more config options, and better see the requirements
  return (
    <Card classes={{root: classes.root}}>
      <Overlay.Wrapper>
        <MuiTable>
          <TableHead className={classes.head}>
            <TR>
              {headerData.map((item, index) => (
                <TD
                  key={index}
                  align={getThAlignment(fieldsConfig, index)}
                  className={classes.cell}
                >
                  {item}
                </TD>
              ))}
            </TR>
          </TableHead>
          <TableBody>
            {bodyData.length ? (
              bodyData.map((row, outerIndex) => (
                <TR key={outerIndex} className={cn(classes.row, hoverable && classes.hoverableRow)}>
                  {row.map((item, innerIndex) => (
                    <TD
                      key={innerIndex}
                      align={getAlignment(fieldsConfig, innerIndex)}
                      className={cn(classes.cell, classes.bodyCell)}
                    >
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

const MobileTable = ({
  headerData,
  bodyData,
  noDataText,
  loading,
  error,
  fieldsConfig,
  hoverable = false,
}: TableProps) => {
  const classes = useTableStyles()
  const {translate: tr} = useI18n()
  const _noDataText = noDataText || tr(messages.noData)

  // TODO: We could have different config/data structure, but I would suggest to refactor that
  // when we have more config options, and better see the requirements
  return (
    <Card classes={{root: classes.root}}>
      <Overlay.Wrapper>
        <MuiTable>
          <TableHead />
          {bodyData.length ? (
            bodyData.map((row, outerIndex) => (
              <TR key={outerIndex} className={cn(classes.row, hoverable && classes.hoverableRow)}>
                <TD className={classes.cell}>
                  {/* This div is needed for fitting KeyValueCard to the cell */}
                  <div>
                    <KeyValueCard.Body
                      items={_.zip(headerData, row).map(([head, item]) => ({
                        label: head,
                        value: item,
                      }))}
                    />
                  </div>
                </TD>
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
        </MuiTable>
        <LoadingOverlay loading={loading} />
        <ErrorOverlay error={error} />
      </Overlay.Wrapper>
    </Card>
  )
}

const Table = (props: TableProps) => {
  return (
    <React.Fragment>
      <Hidden smDown>
        <NormalTable {...props} />
      </Hidden>
      <Hidden mdUp>
        <MobileTable {...props} />
      </Hidden>
    </React.Fragment>
  )
}
export default Table
