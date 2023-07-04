import SignOut from "../SignOut/SignOut";

type SidebarProps = {
  setSelectedTab: (value: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ setSelectedTab }) => {
  return (
    <div className="flex flex-col w-full h-full bg-base-200 justify-between">
      <ul className="menu bg-base-200 rounded-box w-full">
        <li onClick={() => setSelectedTab("games")}>
          <a>games</a>
        </li>
        <li onClick={() => setSelectedTab("users")}>
          <a>users</a>
        </li>
      </ul>
      <SignOut />
    </div>
  );
};
export default Sidebar;
