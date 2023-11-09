import SignOut from "../SignOut/SignOut";
import { Gamepad2, Sparkles, Tag } from "lucide-react";
type SidebarProps = {
  setSelectedTab: (value: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ setSelectedTab }) => {
  return (
    <div className="flex flex-col w-full h-full bg-base-200 justify-between">
      <ul className="menu bg-base-200 rounded-box w-full text-2xl">
        <li onClick={() => setSelectedTab("games")}>
          <a>
            Games
            <Gamepad2 />
          </a>
        </li>
        <li onClick={() => setSelectedTab("recommendations")}>
          <a>
            Recommendations
            <Sparkles />
          </a>
        </li>
        <li onClick={() => setSelectedTab("tags")}>
          <a>
            Tags
            <Tag />
          </a>
        </li>
      </ul>
      <SignOut />
    </div>
  );
};
export default Sidebar;
