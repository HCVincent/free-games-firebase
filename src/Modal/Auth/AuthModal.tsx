import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
import { authModalState } from "@/atoms/authModalAtom";
import OAuthButtons from "./OAuthButtons";

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);

  const handleLogin = () => {
    setModalState((prev) => ({
      ...prev,
      open: true,
      view: "login",
    }));
  };
  const handleSignUp = () => {
    setModalState((prev) => ({
      ...prev,
      open: true,
      view: "signup",
    }));
  };
  return (
    <>
      <label
        htmlFor="my_modal_auth"
        className="btn justify-start items-center hidden lg:flex"
        onClick={handleLogin}
      >
        Login
      </label>
      <label
        htmlFor="my_modal_auth"
        className="btn justify-start items-center hidden lg:flex"
        onClick={handleSignUp}
      >
        Sign up
      </label>
      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id="my_modal_auth"
        className="modal-toggle"
        checked={modalState.open}
      />
      <div className="modal">
        <div className="modal-box">
          <div className="flex flex-col w-full justify-start items-start bg-base-100">
            <label className="label">
              {modalState.view === "login" && "login"}
              {modalState.view === "signup" && "signup"}
            </label>

            <AuthInputs />
            <OAuthButtons />
          </div>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="my_modal_auth"
          onClick={() =>
            setModalState((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          Close
        </label>
      </div>
    </>
  );
};
export default AuthModal;
