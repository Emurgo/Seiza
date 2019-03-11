// @flow
import React from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableRow as TR,
  TableCell as TD,
  Paper,
  Typography,
  Grid,
  withStyles,
} from '@material-ui/core'
import {compose} from 'redux'
import Overlay from './Overlay'
import LoadingOverlay from './LoadingOverlay'
import ErrorOverlay from './ErrorOverlay'

const tableStyles = (theme) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
    'cursor': 'pointer',
  },
  head: {
    textTransform: 'uppercase',
  },
})

export default compose(withStyles(tableStyles))(
  ({i18n, classes, headerData, bodyData, noDataText, loading, error}) => (
    <Paper className={classes.root}>
      <Overlay.Wrapper>
        <Table>
          <TableHead className={classes.head}>
            <TR>
              {headerData.map((item, index) => (
                <TD key={index} align="left">
                  {item}
                </TD>
              ))}
            </TR>
          </TableHead>
          <TableBody>
            {bodyData ? (
              bodyData.map((row, outerIndex) => (
                <TR key={outerIndex} className={classes.row}>
                  {row.map((item, innerIndex) => (
                    <TD key={innerIndex} align="left">
                      {item}
                    </TD>
                  ))}
                </TR>
              ))
            ) : (
              <TR>
                <TD colSpan={headerData.length}>
                  <Grid container justify="space-around" direction="row">
                    <Typography variant="caption">{noDataText}</Typography>
                  </Grid>
                </TD>
              </TR>
            )}
          </TableBody>
        </Table>
        <LoadingOverlay loading={loading} />
        <ErrorOverlay error={error} />
      </Overlay.Wrapper>
    </Paper>
  )
)
