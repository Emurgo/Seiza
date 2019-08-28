import React from 'react'
import cn from 'classnames'
import {makeStyles} from '@material-ui/styles'

import {Divider, ExpansionPanel} from '@/components/visual'
import {CertIconWithLabel} from './utils'

const useStyles = makeStyles(({getContentSpacing, breakpoints}) => ({
  expansionPanel: {
    '&:hover': {
      boxShadow: 'none',
      border: 0,
    },
    'boxShadow': 'none',
    'border': 0,
  },
  expandedArea: {
    marginTop: getContentSpacing(0.75),
    marginBottom: getContentSpacing(0.75),
    paddingInlineStart: '20px',
  },
  horizontalSpacings: {
    marginLeft: getContentSpacing(0.5),
    marginRight: getContentSpacing(0.5),
    [breakpoints.up('sm')]: {
      marginLeft: getContentSpacing(),
      marginRight: getContentSpacing(),
    },
  },
}))

const MobileAction = ({action, label, values}) => {
  const classes = useStyles()
  return (
    <ExpansionPanel
      className={classes.expansionPanel}
      summary={<CertIconWithLabel certType={action.type}>{label}</CertIconWithLabel>}
    >
      <ul className={cn(classes.expandedArea, classes.horizontalSpacings)}>
        {values.map((val, index) => (
          <li key={index}>{val}</li>
        ))}
      </ul>
      <Divider className={classes.horizontalSpacings} light />
    </ExpansionPanel>
  )
}

export default MobileAction
