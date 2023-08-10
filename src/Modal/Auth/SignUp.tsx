import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { sendEmailVerification } from "firebase/auth";
import React, { useState } from "react";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
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
        <div className="form-control w-full mt-4">
          <input
            name="confirmPassword"
            placeholder="confirm Password"
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
        <div className="flex justify-end mt-4">
          <button className="btn " type="submit">
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Sign up"
            )}
          </button>
        </div>
      </form>

      <div className="flex justify-end w-full">
        <p>new here?</p>
        <p
          className="text-red-500"
          onClick={() => {
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }));
          }}
        >
          login
        </p>
      </div>
    </div>
  );
};
export default SignUp;
