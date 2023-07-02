import { authModalState } from "@/atoms/authModalAtom";
import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

const Login: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("onsubmit");
    createUserWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  async function signInWithEmail(email: string, password: string) {}
  return (
    <div className="flex flex-col w-full items-start justify-start">
      <form className="w-full" onSubmit={onSubmit}>
        <div className="form-control w-full mt-4">
          <input
            name="email"
            placeholder="email"
            type="email"
            className="input input-bordered"
            onChange={onChange}
          />
        </div>
        <div className="form-control w-full mt-4">
          <input
            name="password"
            placeholder="password"
            type="password"
            className="input input-bordered"
            onChange={onChange}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
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
