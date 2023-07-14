import { adminModalState } from "@/atoms/adminModalAtom";
import { useRecoilState } from "recoil";
import Add from "./Add";
import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import useGames from "@/hooks/useGames";

type AdminModalProps = {
  setSearchInput: (value: string) => void;
  searchInput: string;
};

const AdminModal: React.FC<AdminModalProps> = ({
  setSearchInput,
  searchInput,
}) => {
  const [modalState, setModalState] = useRecoilState(adminModalState);
  const { readGames } = useGames();
  const handleAdd = () => {
    setModalState((prev) => ({
      ...prev,
      view: "add",
    }));
  };

  const onSubmit = async () => {
    readGames(searchInput);
  };

  return (
    <div className="hidden lg:flex lg:w-full lg:justify-between">
      <label
        htmlFor="my_modal_admin_add"
        className="btn btn-primary"
        onClick={handleAdd}
      >
        add
      </label>

      <input type="checkbox" id="my_modal_admin_add" className="modal-toggle" />
      <div className="modal ">
        <div className="modal-box">
          <div className="flex flex-col w-full justify-start items-start bg-base-100">
            <label className="label">
              {modalState.view === "add" && "add"}
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

      <form onSubmit={onSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            onChange={(e) => setSearchInput(e.currentTarget.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary text-white absolute right-2 bottom-1 hover:bg-purple-900  focus:outline-none focus:bg-primary font-medium rounded-lg text-sm"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};
export default AdminModal;
