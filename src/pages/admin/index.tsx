import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { setTimeout } from "timers/promises";

const AdminHome: React.FC = () => {
  const [user] = useAuthState(auth);
  console.log("AdminHome user", user);
  const route = useRouter();

  return <div>admin</div>;
};

export default AdminHome;
