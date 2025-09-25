import React, { useEffect, useState } from 'react'
import "../styles/UserCard.css"
const UserCard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/auth/current-user/', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access')}`,
  },
})
    .then(res => {
        if (!res.ok) throw new Error('Not authenticated')
        return res.json()
      })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="user_Card">Loading...</div>

  return (
    <div className="user_Card">
      {user ? (
        <>
          <h3>{user.first_name}</h3>
          <p>{user.email}</p>
          <p>{user.address}</p>
        </>
      ) : (
        <p>User not logged in.</p>
      )}
    </div>
  )
}

export default UserCard