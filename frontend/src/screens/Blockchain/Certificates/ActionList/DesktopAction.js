import React from 'react'
import {makeStyles} from '@material-ui/styles'

import {ExpandableCardContent, SummaryCard} from '@/components/visual'
import useModalState from '@/components/hooks/useModalState'
import {CertIconWithLabel} from './utils'
import ExpandButton from './ExpandButton'

const {Row, Label, Value} = SummaryCard

const DEFAULT_VALUES_COUNT_SHOWN = 1

const DesktopActionValues = ({values}) => {
  return values.map((val, index) => <div key={index}>{val}</div>)
}

const useFooterStyles = makeStyles(() => ({
  root: {
    border: 'none',
  },
}))

const DesktopAction = ({action, label, values}) => {
  const {isOpen, toggle} = useModalState()
  const footerClasses = useFooterStyles()

  return (
    <Row>
      <Label>
        <CertIconWithLabel certType={action.type}>{label}</CertIconWithLabel>
      </Label>
      <Value>
        <ExpandableCardContent
          expanded={isOpen}
          onChange={toggle}
          renderHeader={() => (
            <DesktopActionValues values={values.slice(0, DEFAULT_VALUES_COUNT_SHOWN)} />
          )}
          renderExpandedArea={() => (
            <DesktopActionValues values={values.slice(DEFAULT_VALUES_COUNT_SHOWN)} />
          )}
          renderFooter={(expanded) => null}
          footerClasses={footerClasses}
        />
        {values.length > DEFAULT_VALUES_COUNT_SHOWN && (
          <ExpandButton expanded={isOpen} onClick={toggle} />
        )}
      </Value>
    </Row>
  )
}

export default DesktopAction
