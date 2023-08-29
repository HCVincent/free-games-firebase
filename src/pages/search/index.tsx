import React from "react";
import { useSearchParams } from "next/navigation";
type indexProps = {};

const Page: React.FC<indexProps> = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  return <>Search: {search}</>;
};
export default Page;
