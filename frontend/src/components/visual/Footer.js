import React from 'react'
import stayInTouch from '../../tmp_assets/tmp-footer-stay-in-touch.png'
import footerContent from '../../tmp_assets/tmp-footer-content.png'
import {Grid} from '@material-ui/core'

const Footer = () => (
  <div>
    <div className="gradient-bg">
      <Grid container direction="row" justify="space-around">
        <img alt="" src={stayInTouch} />
      </Grid>
    </div>
    <div style={{background: '#120547'}}>
      <Grid container direction="row" justify="space-around">
        <img alt="" src={footerContent} />
      </Grid>
    </div>
  </div>
)

export default Footer
