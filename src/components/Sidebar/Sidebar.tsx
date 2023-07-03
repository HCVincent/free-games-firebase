const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-screen bg-base-200 justify-between">
      <ul className="menu bg-base-200 rounded-box w-full">
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
        <li>
          <a>Item 3</a>
        </li>
      </ul>
      <button className="btn btn-primary">Sign out</button>
    </div>
  );
};
export default Sidebar;
