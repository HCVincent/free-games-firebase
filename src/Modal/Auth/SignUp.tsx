import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import React, { useState } from "react";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

const SignUp = () => {
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const options = {
    sendEmailVerification: true,
  };
  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth, options);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError("");
    if (signUpForm.password != signUpForm.confirmPassword) {
      setError("Passwords are not match");
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
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
            name="email"
            placeholder="Email"
            type="email"
            className="input input-bordered"
            onChange={onChange}
          />
        </div>
        <div className="form-control w-full mt-4">
          <label htmlFor="password">Password:</label>
          <input
            name="password"
            placeholder="Password"
            type="password"
            className="input input-bordered"
            onChange={onChange}
          />
        </div>
        <div className="form-control w-full mt-4">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            className="input input-bordered"
            onChange={onChange}
          />
        </div>
        {(error || userError) && (
          <p className="text-red-600 text-sm">
            {error ||
              FIREBASE_ERRORS[
                userError?.message as keyof typeof FIREBASE_ERRORS
              ]}
          </p>
        )}
        <div className="flex justify-end mt-4 p-2">
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <button
              className="btn btn-primary"
              type="submit"
            >{`Sign up`}</button>
          )}
        </div>
      </form>

      <div className="flex justify-end w-full text-lg">
        <p>new here?</p>
        <button
          className="text-red-500  btn-ghost capitalize"
          onClick={() => {
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }));
          }}
        >
          login
        </button>
      </div>
    </div>
  );
};
export default SignUp;
