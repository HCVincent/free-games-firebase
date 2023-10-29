import { Game, gameState } from "@/atoms/gamesAtom";
import { useSetRecoilState } from "recoil";

const useStateValue = () => {
  const setGameStateValue = useSetRecoilState(gameState);
  const onSelectDownload = (game: Game) => {
    setGameStateValue((prev) => ({
      ...prev,
      selectedGame: game,
    }));
    // router.push(`/downloads/${game.id}`);
    window.open(`/downloads/${game.id}`, "_blank");
  };
  return {
    setGameStateValue,
    onSelectDownload,
  };
};
export default useStateValue;
