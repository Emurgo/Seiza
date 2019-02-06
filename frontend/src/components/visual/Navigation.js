import React from 'react'
import {Link} from 'react-router-dom'

const Navigation = ({items = []}) => (
  <nav>
    <ul>
      {items.map(({link, label}) => (
        <li key={label}>
          <Link to={link}>{label}</Link>
        </li>
      ))}
    </ul>
  </nav>
)

export default Navigation
