import React, { useEffect, useState } from "react";
import "../styles/UserCard.css";

const UserCard = ({ scale, offset }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [worldPos] = useState(() => ({
    x: 100,
    y: 100,
  }));

  useEffect(() => {
    fetch("http://localhost:8000/api/auth/current-user/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const screenX = worldPos.x * scale + offset.x;
  const screenY = worldPos.y * scale + offset.y;

  if (loading) return <div className="user_Card">Loading...</div>;

  return (
    <div
      className="user_Card"
      style={{
        position: "absolute",
        left: `${screenX}px`,
        top: `${screenY}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
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
  );
};

export default UserCard;
