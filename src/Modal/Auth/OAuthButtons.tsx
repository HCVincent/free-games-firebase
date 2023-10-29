import { auth } from "@/firebase/clientApp";
import Image from "next/image";
import React from "react";
import {
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  return (
    <div className="flex flex-col w-full mb-4">
      {googleLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <button className="btn mt-2 " onClick={() => signInWithGoogle()}>
          <Image
            height={100}
            width={100}
            src="/googlelogo.png"
            alt="OAuthGoogle"
            className="h-4 w-4 mr-4"
          />
          Continue with Google
        </button>
      )}

      {googleError && <span>{googleError?.message}</span>}
    </div>
  );
};
export default OAuthButtons;
