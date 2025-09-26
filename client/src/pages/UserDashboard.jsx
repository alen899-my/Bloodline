import React from "react";
import UserCard from "../components/UserCard";
import InfiniteCanvas from "../components/InfiniteCanvas";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  return (
    <div className="userdashboard_container">
      <div className="main_user">
        <InfiniteCanvas className="infinitecanvas">
          <UserCard />
        </InfiniteCanvas>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default UserDashboard;
=======
export default UserDashboard;
>>>>>>> 7f0a6999255e87fd8d5c6d74683dd4d23a3f4641
