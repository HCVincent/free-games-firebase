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
    <button
      className="lg:flex btn w-full justify-center items-center"
      onClick={logout}
    >
      {loading ? <span className="loading loading-spinner"></span> : "Sign out"}
    </button>
  );
};
export default SignOut;
