import { User } from "firebase/auth";
import React from "react";

type CollectionsProps = {
  user: User;
};

const Collections: React.FC<CollectionsProps> = ({ user }) => {
  return <div>Have a good coding</div>;
};
export default Collections;
