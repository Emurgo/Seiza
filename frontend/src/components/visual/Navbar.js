import React from 'react'
import {Link} from 'react-router-dom'

const styles = {
  list: {listStyleType: 'none'},
  item: {display: 'inline', margin: '5px'},
}

const Navbar = ({items = []}) => (
  <nav>
    <ul style={styles.list}>
      {items.map(({link, label}) => (
        <li key={label} style={styles.item}>
          <Link to={link}>{label}</Link>
        </li>
      ))}
    </ul>
  </nav>
)

export default Navbar
