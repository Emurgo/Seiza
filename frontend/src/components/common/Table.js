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
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {defineMessages} from 'react-intl'
import cn from 'classnames'
import {fade} from '@material-ui/core/styles/colorManipulator'

import {Card, KeyValueCard, Overlay} from '@/components/visual'
import {useI18n} from '@/i18n/helpers'
import {useIsMobile} from '@/components/hooks/useBreakpoints'
import {LoadingOverlay, ErrorOverlay} from '@/components/common'

export const ROW_TYPE = {
  DATA: 'data',
  SEPARATOR: 'separator',
}

const messages = defineMessages({
  noData: 'No data to show.',
})

const useTableStyles = makeStyles(({hover, palette}) => ({
  wrapperRoot: {
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
    'borderTop': '1px solid transparent', // Note: for rows not to change size on hover
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
  separatorContainerDesktop: {
    height: '20px',
    padding: '0px',
    borderTop: '1px solid transparent',
  },
  separatorLine: {
    borderBottom: '1px solid #aaa',
    flexGrow: 1,
    margin: '10px 10px 10px 10px',
  },
  mobileTable: {
    minHeight: '100px',
  },
}))

type TableProps = {|
  headerData: Array<Object>,
  bodyData: Array<Object>,
  fieldsConfig?: Array<{|
    align?: string,
    thAlign?: string,
  |}>,
  loading: boolean,
  error: any,
  hoverable?: boolean,
|}

type _TableProps = {|
  ...TableProps,
  noDataRenderer: any,
|}

const getAlignment = (fieldsConfig, index) => (fieldsConfig ? fieldsConfig[index].align : 'left')

const getThAlignment = (fieldsConfig, index) =>
  fieldsConfig ? fieldsConfig[index].thAlign || fieldsConfig[index].align : 'left'

const DesktopTHead = ({headerData, fieldsConfig}) => {
  const classes = useTableStyles()
  return (
    <TableHead className={classes.head}>
      <TR>
        {headerData.map((item, index) => (
          <TD key={index} align={getThAlignment(fieldsConfig, index)} className={classes.cell}>
            {item}
          </TD>
        ))}
      </TR>
    </TableHead>
  )
}

const DesktopRowData = ({row: {data}, fieldsConfig}) => {
  const classes = useTableStyles()

  return (
    <React.Fragment>
      {data.map((item, index) => (
        <TD
          key={index}
          align={getAlignment(fieldsConfig, index)}
          className={cn(classes.cell, classes.bodyCell)}
        >
          {item}
        </TD>
      ))}
    </React.Fragment>
  )
}

const DesktopSeparator = ({fieldsConfig, row: {text}}) => {
  const classes = useTableStyles()
  return (
    <td colSpan="8" className={classes.separatorContainerDesktop}>
      <Grid container>
        <div className={classes.separatorLine} />
        <Typography>{text}</Typography>
        <div className={classes.separatorLine} />
      </Grid>
    </td>
  )
}

const DesktopTable = ({
  headerData,
  bodyData,
  loading,
  error,
  fieldsConfig,
  hoverable = false,
  noDataRenderer,
}: _TableProps) => {
  const classes = useTableStyles()

  // TODO: We could have different config/data structure, but I would suggest to refactor that
  // when we have more config options, and better see the requirements
  return (
    <MuiTable>
      <DesktopTHead headerData={headerData} fieldsConfig={fieldsConfig} />
      <TableBody>
        {bodyData.length > 0 ? (
          bodyData.map((row, index) => {
            const Renderer = {
              [ROW_TYPE.DATA]: DesktopRowData,
              [ROW_TYPE.SEPARATOR]: DesktopSeparator,
            }[row.type]

            return (
              <TR
                key={index}
                className={cn(
                  classes.row,
                  hoverable && row.type === ROW_TYPE.DATA && classes.hoverableRow
                )}
              >
                <Renderer {...{row, fieldsConfig}} />
              </TR>
            )
          })
        ) : (
          <React.Fragment>
            <TR>
              <TD colSpan={headerData.length} rowSpan={2}>
                {noDataRenderer()}
              </TD>
            </TR>
            <TR />
          </React.Fragment>
        )}
      </TableBody>
    </MuiTable>
  )
}

const MobileBodyData = ({fieldsConfig, row, headerData, hoverable}) => {
  return (
    <KeyValueCard.Body
      items={_.zip(headerData, row.data).map(([head, item]) => ({
        label: head,
        value: item,
      }))}
    />
  )
}

const MobileSeparator = ({fieldsConfig, row: {text}, hoverable}) => {
  const classes = useTableStyles()
  return (
    <Grid container>
      <div className={classes.separatorLine} />
      <span>{text}</span>
      <div className={classes.separatorLine} />
    </Grid>
  )
}

const MobileTable = ({
  headerData,
  bodyData,
  loading,
  error,
  fieldsConfig,
  hoverable = false,
  noDataRenderer,
}: _TableProps) => {
  const classes = useTableStyles()

  // TODO: We could have different config/data structure, but I would suggest to refactor that
  // when we have more config options, and better see the requirements
  return (
    <div className={classes.mobileTable}>
      {bodyData.length > 0 ? (
        bodyData.map((row, index) => {
          const Renderer = {
            [ROW_TYPE.DATA]: MobileBodyData,
            [ROW_TYPE.SEPARATOR]: MobileSeparator,
          }[row.type]

          return (
            <div
              key={index}
              className={cn(
                classes.row,
                hoverable && row.type === ROW_TYPE.DATA && classes.hoverableRow
              )}
            >
              <Renderer {...{row, fieldsConfig, headerData}} />
            </div>
          )
        })
      ) : (
        <Grid style={{height: 100}} container direction="column" justify="space-around">
          {noDataRenderer()}
        </Grid>
      )}
    </div>
  )
}

const TableWrapper = ({loading, error, children}: any) => {
  const classes = useTableStyles()

  return (
    <Card classes={{root: classes.wrapperRoot}}>
      <Overlay.Wrapper>
        {children}
        <LoadingOverlay loading={loading} />
        <ErrorOverlay error={error} />
      </Overlay.Wrapper>
    </Card>
  )
}

const Table = (props: TableProps) => {
  const {translate: tr} = useI18n()
  const _noDataText = tr(messages.noData)
  const isMobile = useIsMobile()

  const noDataRenderer = () =>
    !props.loading && (
      <Grid container justify="space-around" direction="row">
        <Typography variant="caption">{_noDataText}</Typography>
      </Grid>
    )

  const TableImpl = isMobile ? MobileTable : DesktopTable

  return (
    <TableWrapper loading={props.loading} error={props.error}>
      <TableImpl {...props} noDataRenderer={noDataRenderer} />
    </TableWrapper>
  )
}
export default Table
