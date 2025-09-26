import React, { useEffect, useState } from "react";
import "../styles/UserCard.css";

const UserCard = ({ scale, offset }) => {
  const [apiUser, setApiUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
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
      .then((data) => {
        setApiUser({ ...data, worldPos: { x: 0, y: 0 } });
      })
      .catch(() => setApiUser(null));
  }, []);

  // Fetch ONLY users with the same address
  useEffect(() => {
    if (!apiUser) return;

    fetch("http://localhost:8000/api/auth/same-address-users/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        const userCount = data.length;
        const range = Math.max(300, Math.min(800, userCount * 60));
        const minSpacing = 60;

        const positionedUsers = [];

        data.forEach((user) => {
          let x, y, valid = false, attempts = 0;
          while (!valid && attempts < 200) {
            x = Math.random() * 2 * range - range;
            y = Math.random() * 2 * range - range;

            valid = positionedUsers.every((u) => {
              const dist = Math.sqrt(
                Math.pow(u.worldPos.x - x, 2) +
                  Math.pow(u.worldPos.y - y, 2)
              );
              return dist >= minSpacing;
            });

            attempts++;
          }

          positionedUsers.push({ ...user, worldPos: { x, y } });
        });

        setUsers(positionedUsers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiUser]);

  if (loading) return <div className="user_Card">Loading...</div>;

  const allUsers = apiUser ? [apiUser, ...users] : users;

  return (
    <>
      {/* Connect all users with the same address */}
      {allUsers.map((userA, i) =>
        allUsers.map((userB, j) => {
          if (i >= j) return null;
          if (userA.address !== userB.address) return null;

          const x1 = userA.worldPos.x * scale + offset.x;
          const y1 = userA.worldPos.y * scale + offset.y;
          const x2 = userB.worldPos.x * scale + offset.x;
          const y2 = userB.worldPos.y * scale + offset.y;

          return (
            <svg
              key={`line-${i}-${j}`}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 5,
              }}
            >
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="red"
                strokeWidth={2 / scale}
              />
            </svg>
          );
        })
      )}

      {/* Render user cards */}
      {allUsers.map((user, i) => {
        const screenX = user.worldPos.x * scale + offset.x;
        const screenY = user.worldPos.y * scale + offset.y;

        return (
          <div
            key={i}
            className="user_Card"
            style={{
              position: "absolute",
              left: `${screenX}px`,
              top: `${screenY}px`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              border:
                apiUser && i === 0 ? "2px solid gold" : "1px solid #00000088",
            }}
          >
            <h3>{user.first_name}</h3>
            <p>{user.email}</p>
            <p>{user.address}</p>
          </div>
        );
      })}
    </>
  );
};

export default UserCard;
