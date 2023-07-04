import AdminPageContent from "@/components/AdminPageContent/AdminPageContent";
import CrudButtons from "@/components/CrudButtons/CrudButtons";
import AdminPage from "@/components/Layout/AdminPage";
import Sidebar from "@/components/Sidebar/Sidebar";
import SignOut from "@/components/SignOut/SignOut";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const formTabs = [{ title: "games" }, { title: "users" }];

const AdminHome: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [user, loading, error] = useAuthState(auth);
  const route = useRouter();
  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (user) {
    user
      ?.getIdTokenResult()
      .then((idTokenResult) => {
        if (!idTokenResult.claims.admin) {
          route.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
        route.push("/");
      });
  } else {
    route.push("/");
  }
  return (
    <AdminPage>
      <Sidebar setSelectedTab={setSelectedTab} />
      <AdminPageContent selectedTab={selectedTab}></AdminPageContent>
    </AdminPage>
  );
};

export default AdminHome;
