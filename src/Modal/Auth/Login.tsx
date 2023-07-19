import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

const Login: React.FC = () => {
  const route = useRouter();
  const setAuthModalState = useSetRecoilState(authModalState);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signInWithEmailAndPassword, userCred, loading, userError] =
    useSignInWithEmailAndPassword(auth);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) {
      setError("");
    }
    try {
      await signInWithEmailAndPassword(loginForm.email, loginForm.password);
    } catch (error: any) {
      setError(error);
      console.log("signInWithEmailAndPassword Error", error);
    }

    await auth.currentUser
      ?.getIdTokenResult()
      .then((idTokenResult) => {
        // Confirm the user is an Admin.
        if (!!idTokenResult.claims.admin) {
          // Show admin UI.
          setCookie("isAdmin", "true");
          route.push("/admin");
        } else {
          deleteCookie("isAdmin");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="flex flex-col w-full items-start justify-start">
      <form className="w-full" onSubmit={onSubmit}>
        <div className="form-control w-full mt-4">
          <input
            required
            name="email"
            placeholder="email"
            type="password"
            className="input input-bordered bg-base-300 focus:outline-none"
            onChange={onChange}
          />
        </div>
        <div className="form-control w-full mt-4">
          <input
            required
            name="password"
            placeholder="password"
            type="password"
            className="input input-bordered bg-base-300 focus:outline-none"
            onChange={onChange}
          />
        </div>
        <button className="btn btn-primary mt-8" type="submit">
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>
      {error ||
        FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      <div className="flex">
        <p>new here?</p>
        <p
          className="text-red-500"
          onClick={() => {
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup",
            }));
          }}
        >
          signup
        </p>
      </div>
    </div>
  );
};
export default Login;
