import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
import { authModalState } from "@/atoms/authModalAtom";

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);

  const handleLogin = () => {
    setModalState((prev) => ({
      ...prev,
      view: "login",
    }));
  };
  const handleSignUp = () => {
    setModalState((prev) => ({
      ...prev,
      view: "signup",
    }));
  };
  return (
    <>
      <label htmlFor="my_modal_auth" className="btn" onClick={handleLogin}>
        Login
      </label>
      <label htmlFor="my_modal_auth" className="btn" onClick={handleSignUp}>
        Sign up
      </label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_auth" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="flex flex-col w-full justify-start items-start bg-base-100">
            <label className="label">
              {modalState.view === "login" && "login"}
              {modalState.view === "signup" && "signup"}
            </label>

            <AuthInputs />
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_auth">
          Close
        </label>
      </div>
    </>
  );
};
export default AuthModal;
