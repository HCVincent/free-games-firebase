import { auth } from "@/firebase/clientApp";
import { deleteCookie } from "cookies-next";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";

type SignOutProps = {};

const SignOut: React.FC<SignOutProps> = () => {
  const [signOut, loading, error] = useSignOut(auth);
  const logout = async () => {
    deleteCookie("isAdmin");
    await signOut();
  };
  return (
    <div className="lg:flex w-full justify-center" onClick={logout}>
      {loading ? <span className="loading loading-spinner"></span> : "Sign out"}
    </div>
  );
};
export default SignOut;
