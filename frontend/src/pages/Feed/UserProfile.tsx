import React from "react";
import { useParams } from "react-router";
import Profile from "../../components/feed/Profile";

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div>
      <section>
        <Profile userId={userId} />
      </section>
    </div>
  );
};

export default UserProfile;
