import React, { useEffect, useState } from "react";
import "../styles/UserCard.css";

// Helper to generate random positions across all quadrants
const generateDummyUsers = (count, range = 2000, minSpacing = 120) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let validPosition = false;
    let x, y;
    
    // Try to find a non-overlapping position across all quadrants
    while (!validPosition && attempts < 100) {
      // Generate positions in all quadrants (-range to +range)
      x = (Math.random() * 2 * range) - range; // -range to +range
      y = (Math.random() * 2 * range) - range; // -range to +range
      
      // Check if this position is too close to existing users
      validPosition = true;
      for (const user of users) {
        const distance = Math.sqrt(
          Math.pow(user.worldPos.x - x, 2) + Math.pow(user.worldPos.y - y, 2)
        );
        if (distance < minSpacing) {
          validPosition = false;
          break;
        }
      }
      
      attempts++;
      
      // If we can't find a perfect spot after many attempts, relax the constraints
      if (attempts > 50) {
        minSpacing = minSpacing * 0.8;
      }
    }
    
    users.push({
      first_name: `User${i + 1}`,
      email: `user${i + 1}@example.com`,
      address: `${Math.floor(Math.random() * 1000)} Random Street`,
      worldPos: { x, y },
    });
  }
  
  return users;
};

const dummyUsers = generateDummyUsers(50);

const UserCard = ({ scale, offset }) => {
  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      .then((data) =>
        setApiUser({ ...data, worldPos: { x: 0, y: 0 } }) // Center at origin (0,0)
      )
      .catch(() => setApiUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="user_Card">Loading...</div>;

  const allUsers = apiUser ? [apiUser, ...dummyUsers] : dummyUsers;

  // API user's screen position for connecting lines (centered at origin)
  const apiScreenX = apiUser ? apiUser.worldPos.x * scale + offset.x : 0;
  const apiScreenY = apiUser ? apiUser.worldPos.y * scale + offset.y : 0;

  return (
    <>
      {/* Draw connecting lines */}
      {apiUser &&
        dummyUsers.map((user, i) => {
          const screenX = user.worldPos.x * scale + offset.x;
          const screenY = user.worldPos.y * scale + offset.y;

          return (
            <svg
              key={`line-${i}`}
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
                x1={apiScreenX}
                y1={apiScreenY}
                x2={screenX}
                y2={screenY}
                stroke="red"
                strokeWidth={2 / scale}
              />
            </svg>
          );
        })}

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