import { adminModalState } from "@/atoms/adminModalAtom";
import { useRecoilState } from "recoil";
import Add from "./Add";

const AdminModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(adminModalState);

  const handleAdd = () => {
    setModalState((prev) => ({
      ...prev,
      view: "add",
    }));
  };

  return (
    <div className="flex w-full">
      <label
        htmlFor="my_modal_admin_add"
        className="btn btn-primary"
        onClick={handleAdd}
      >
        add
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_admin_add" className="modal-toggle" />
      <div className="modal ">
        <div className="modal-box">
          <div className="flex flex-col w-full justify-start items-start bg-base-100">
            <label className="label">
              {modalState.view === "add" && "add"}
              {modalState.view === "update" && "update"}
            </label>

            <div className="flex flex-col w-full">
              {modalState.view === "add" && <Add />}
            </div>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_admin_add">
          Close
        </label>
      </div>
    </div>
  );
};
export default AdminModal;
