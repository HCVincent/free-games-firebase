import { GameTag } from "@/atoms/gamesAtom";
import TagCard from "@/components/TagCard/TagCard";
import { firestore } from "@/firebase/clientApp";
import useGames from "@/hooks/useGames";
import { collection, doc, getDoc, runTransaction } from "firebase/firestore";
import React, { useState } from "react";

type TagsProps = {};

const Tags: React.FC<TagsProps> = () => {
  const { onSelectGame, gameStateValue, setGameStateValue } = useGames();
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (error) {
      setError("");
    }
    setLoading(true);
    try {
      const tagDocRef = doc(firestore, "tags", tagName);
      await runTransaction(firestore, async (transaction) => {
        const tagDoc = await getDoc(tagDocRef);
        if (tagDoc.exists()) {
          throw new Error(`Sorry, r/${tagName} exists. Try another.`);
        }
        transaction.set(tagDocRef, {
          id: tagDocRef.id,
          title: tagName,
          gameId: [],
        });
      });
      const gameTag = [...gameStateValue.gameTag];
      setGameStateValue((pref) => ({
        ...pref,
        gameTag: [...gameTag, { id: tagDocRef.id, title: tagName, gameId: [] }],
      }));
    } catch (error: any) {
      console.log("add tags error", error);
      setError(error.message);
    }
    setTagName("");
    setLoading(false);
  };
  return (
    <div className="flex flex-col w-full h-full  ">
      <div className="w-full h-full">
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-primary w-full max-w-xs border-none"
          value={tagName}
          onChange={(e) => {
            setError("");
            setTagName(e.currentTarget.value);
          }}
        />
      </div>
      <div className="flex w-full justify-end">
        <button
          className="btn btn-primary mt-4"
          onClick={(e) => {
            e.preventDefault;
            onSubmit();
          }}
        >
          {loading ? <span className="loading loading-spinner"></span> : "Add"}
        </button>
      </div>
      <div className="text-red-500"> {error}</div>

      <div className="flex mt-10">
        {gameStateValue.gameTag.map((tag) => (
          <TagCard tag={tag} key={tag.id}></TagCard>
        ))}
      </div>
    </div>
  );
};
export default Tags;
