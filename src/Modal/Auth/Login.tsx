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
    email: "111@111.com",
    password: "111111",
  });
  const [signInWithEmailAndPassword, userCred, loading, userError] =
    useSignInWithEmailAndPassword(auth);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) {
      setError("");
    }
    try {
      await signInWithEmailAndPassword(loginForm.email!, loginForm.password!);
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
    <div className="flex flex-col w-full items-start justify-start space-y-2">
      <form className="w-full" onSubmit={onSubmit}>
        <div className="form-control w-full mt-4">
          <label htmlFor="email">Email:</label>
          <input
            required
            name="email"
            placeholder="Email"
            type="email"
            value={loginForm.email!}
            className="input input-bordered bg-base-300 focus:outline-none"
            onChange={onChange}
          />
        </div>
        <div className="form-control w-full mt-4">
          <label htmlFor="password">Password:</label>
          <input
            required
            name="password"
            placeholder="Password"
            type="password"
            value={loginForm.password!}
            className="input input-bordered bg-base-300 focus:outline-none"
            onChange={onChange}
          />
        </div>
        <div className="font-bold text-xl">
          Notice: Please log in with default manager account.
        </div>
        <div className="flex justify-end">
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <button className="btn btn-primary mt-8" type="submit">
              {"Login"}
            </button>
          )}
        </div>
      </form>
      {error ||
        FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      <div className="flex justify-end w-full p-2">
        <p>new here? </p>
        <button
          className="text-red-500  btn-ghost capitalize"
          onClick={() => {
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup",
            }));
          }}
        >
          sign up
        </button>
      </div>
    </div>
  );
};
export default Login;
