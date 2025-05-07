import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {logo,sun} from '../assets'
import {navlinks} from '../constants'

const Sidebar = () => {
    const navigate = useNavigate();
    const [isActive,setIsActive] = React.useState('dashboard');
    const [toggle,setToggle] = React.useState(false);


  return (
    <div>Sidebar</div>
  )
}

export default Sidebar