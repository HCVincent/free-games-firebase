import { auth } from "@/firebase/clientApp";
import React from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

const Index: React.FC = () => {
  const [user] = useAuthState(auth);
  console.log("testtest", user);
  return <div>Have a good coding</div>;
};
export default Index;
