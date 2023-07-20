import AuthModal from "@/Modal/Auth/AuthModal";
import GamesRead from "@/components/AdminPageContent/GamesCrud/GamesRead";
import Layout from "@/components/Layout/Layout";
import SignOut from "@/components/SignOut/SignOut";
import { auth } from "@/firebase/clientApp";
import { deleteCookie, setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Home: React.FC = () => {
  return (
    <div className="flex w-full items-center">
      <Layout>
        <div className="flex flex-col w-full lg:w-5/6 border-lime-300 border-2">
          <GamesRead />
        </div>
      </Layout>
    </div>
  );
};

export default Home;
