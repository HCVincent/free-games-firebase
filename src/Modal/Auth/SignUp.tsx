import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

const SignUp = () => {
  const [error, setError] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(
      "auth.currentUser?.getIdTokenResult()",
      auth.currentUser?.getIdTokenResult()
    );

    event.preventDefault();
    if (error) setError("");
    if (signUpForm.password != signUpForm.confirmPassword) {
      setError("Passwords are not match");
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  // const onVerify = async (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   const success = await sendEmailVerification();
  //   if (success) {
  //     alert("Sent email");
  //     setVerify(true);
  //   }
  // };

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
        <button className="btn btn-primary" type="submit">
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Sign up"
          )}
        </button>
        {/* <button className="btn btn-primary" onClick={onVerify}>
          Verify email
        </button>
        {verifyEmailError && (
          <p className="text-red-600 text-sm">verifyEmailError</p>
        )} */}
      </form>

      <div className="flex">
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
