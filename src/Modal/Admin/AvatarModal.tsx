import { useRecoilState } from "recoil";
import { avatarModalState } from "@/atoms/avatarModalAtom";
import AvatarUpdate from "./AvatarUpdate";
import { User } from "firebase/auth";
type AvatarModalProps = {
  user: User;
  setUserPhoto: (photoUrl: string) => void;
};
const AvatarModal: React.FC<AvatarModalProps> = ({ user, setUserPhoto }) => {
  const [modalState, setModalState] = useRecoilState(avatarModalState);
  return (
    <div className="flex">
      <input type="checkbox" id="my_modal_avatar" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="flex flex-col w-full justify-start items-start bg-base-100">
            <label className="flex w-full label justify-center">
              {modalState.view === "avatar" && "Update Avatar"}
            </label>

            <div className="flex flex-col w-full">
              {modalState.view === "avatar" && (
                <AvatarUpdate user={user} setUserPhoto={setUserPhoto} />
              )}
            </div>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_avatar">
          Close
        </label>
      </div>
    </div>
  );
};
export default AvatarModal;
