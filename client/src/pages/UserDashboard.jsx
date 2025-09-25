import React from 'react'
import UserCard from '../components/UserCard'
import InfiniteCanvas from '../components/InfiniteCanvas'
import "../styles/UserDashboard.css"
const UserDashboard = () => {
  return (
    <div className="userdashboard_container">
        <div className="main_user">
            <InfiniteCanvas className='infinitecanvas'/>
            <UserCard className="usercard"/>
        </div>
    </div>
  )
}

export default UserDashboard