import React from "react";

type LoadingProps = {};

const Loading: React.FC<LoadingProps> = () => {
  return (
    <div>
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};
export default Loading;
