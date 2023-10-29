import { firestore } from "@/firebase/clientApp";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import React, { useState } from "react";

type CrudButtonsProps = {};

const CrudButtons: React.FC<CrudButtonsProps> = () => {
  const [loading, setLoading] = useState(false);
  const handleAdd = async () => {
    setLoading(true);
    try {
      const gameDocRef = doc(firestore, "games", "test");
      await runTransaction(firestore, async (transaction) => {
        const gameDoc = await getDoc(gameDocRef);
        if (gameDoc.exists()) {
          throw new Error(`Sorry, ${gameDoc} is taken. Try another.`);
        }
        transaction.set(gameDocRef, {
          gameName: "",
          createdAt: serverTimestamp(),
        });
      });
    } catch (error: any) {
      console.log("handleCreateCommunity error", error);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col">
      <button className="btn btn-primary">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "display"
        )}
      </button>
      <button className="btn btn-primary mt-2" onClick={handleAdd}>
        {loading ? <span className="loading loading-spinner"></span> : "add"}
      </button>
      <button className="btn btn-primary mt-2">
        {loading ? <span className="loading loading-spinner"></span> : "delete"}
      </button>
      <button className="btn btn-primary mt-2">
        {loading ? <span className="loading loading-spinner"></span> : "update"}
      </button>
    </div>
  );
};
export default CrudButtons;
