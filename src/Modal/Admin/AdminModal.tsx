import { adminModalState } from "@/atoms/adminModalAtom";
import { useRecoilState } from "recoil";
import AdminInputs from "./AdminInputs";

const AdminModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(adminModalState);

  const handleLogin = () => {
    setModalState((prev) => ({
      ...prev,
      view: "add",
    }));
  };
  const handleSignUp = () => {
    setModalState((prev) => ({
      ...prev,
      view: "update",
    }));
  };
  return (
    <>
      <label htmlFor="my_modal_7" className="btn" onClick={handleLogin}>
        add
      </label>
      <label htmlFor="my_modal_7" className="btn" onClick={handleSignUp}>
        update
      </label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="flex flex-col w-full justify-start items-start bg-base-100">
            <label className="label">
              {modalState.view === "add" && "add"}
              {modalState.view === "update" && "update"}
            </label>

            <AdminInputs />
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
};
export default AdminModal;
