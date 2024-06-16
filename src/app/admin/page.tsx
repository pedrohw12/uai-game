"use client";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Team } from "@/types";
import { Plus, X, Pencil, Check, Dot } from "lucide-react";

export default function AdminPage() {
  const [score, setScore] = useState("");
  const [totalKills, setTotalKills] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [player, setPlayer] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newScore, setNewScore] = useState<string>("");
  const [newTotalKills, setNewTotalKills] = useState<string>("");

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollection = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollection);
      const teamsList = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Team[];
      setTeams(teamsList.sort((a, b) => b.score - a.score));
    };

    fetchTeams();
  }, []);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (players.length === 0) {
      alert("Please fill out all fields!");
      return;
    }
    try {
      const parsedScore = parseFloat(score);
      const docRef = await addDoc(collection(db, "teams"), {
        score: parsedScore,
        totalKills: parseInt(totalKills),
        players,
      });
      setTeams(
        [
          ...teams,
          {
            id: docRef.id,
            score: parsedScore,
            totalKills: parseInt(totalKills),
            players,
          },
        ].sort((a, b) => b.score - a.score)
      );
      setScore("");
      setTotalKills("");
      setPlayers([]);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleAddPlayer = () => {
    if (!player.trim()) {
      return;
    }
    setPlayers([...players, player]);
    setPlayer("");
  };

  const deletePlayer = (indexToRemove: number) => {
    setPlayers((prevPlayers) => {
      return prevPlayers.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handlePlayerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPlayer();
    }
  };
  const handleEdit = (team: Team) => {
    setIsEditing(team.id);
    setNewScore(team.score.toString());
    setNewTotalKills(team.totalKills.toString());
  };

  const handleUpdate = async (teamId: string) => {
    try {
      const parsedScore = parseFloat(newScore);
      const parsedTotalKills = parseInt(newTotalKills);
      const teamDoc = doc(db, "teams", teamId);
      await updateDoc(teamDoc, {
        score: parsedScore,
        totalKills: parsedTotalKills,
      });

      const updatedTeams = teams
        .map((team) =>
          team.id === teamId
            ? {
                ...team,
                score: parsedScore,
                totalKills: parsedTotalKills,
              }
            : team
        )
        .sort((a, b) => b.score - a.score);

      setTeams(updatedTeams);
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black">
      <h1
        className="text-4xl font-bold mb-5 my-4 text-white 
       text-center"
      >
        Admin Panel
      </h1>
      <form
        onSubmit={handleAddTeam}
        className="bg-gray-500/40 text-white p-6 rounded shadow-md mb-4 w-[90%] md:w-[65%]"
      >
        <h2 className="text-xl font-bold mb-4 text-white">Add New Team</h2>
        <div className="flex space-x-4">
          <input
            type="number"
            step="0.1"
            onKeyDown={handleKeyDown}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Score"
            className="w-full p-2 mb-4 rounded outline-none bg-black"
            required
            autoFocus
          />
          <input
            type="number"
            value={totalKills}
            onChange={(e) => setTotalKills(e.target.value)}
            placeholder="Total Kills"
            onKeyDown={handleKeyDown}
            className="w-full p-2 mb-4 rounded outline-none bg-black"
            required
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2 text-white">Players</h3>
          <div className="flex">
            <input
              type="text"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              placeholder="Player Name"
              onKeyDown={handlePlayerKeyDown}
              className="w-full p-2 outline-none bg-black rounded"
            />
            <button
              type="button"
              onClick={handleAddPlayer}
              className=" bg-another-purple rounded-r px-3"
            >
              <Plus />
            </button>
          </div>

          <ul className="mt-8">
            {players.map((player, index) => (
              <li
                key={index}
                className="text-white pb-2 md:text-lg flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Dot className="stroke-another-green" /> {player}
                </div>

                <button
                  onClick={() => deletePlayer(index)}
                  title="Delete player"
                  className="mr-3"
                  type="button"
                >
                  {" "}
                  <X size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="submit"
          className="w-full p-2 text-purple-dark font-bold bg-another-green rounded"
        >
          Add Team
        </button>
      </form>

      <div className="w-[90%] md:w-[65%] text-white">
        {teams.map((team, index) => (
          <div key={team.id} className="bg-gray-500/40 rounded mb-4">
            <h3 className="text-lg md:text-xl font-semibold py-6 text-center">
              RANK - {index + 1}
            </h3>

            <div className="rounded bg-black mx-6 py-3 px-2 mt-4 flex items-center text-white text-lg md:px-7">
              {isEditing === team.id ? (
                <div className="w-full">
                  <label
                    htmlFor="score"
                    className="text-another-purple block font-bold"
                  >
                    Score:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="score"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    className=" w-4/5 md:w-3/5 p-1 mb-4 border rounded outline-none bg-black"
                  />
                  <label
                    htmlFor="total-kills"
                    className="text-another-purple font-bold block"
                  >
                    Total Kills:
                  </label>
                  <input
                    type="number"
                    id="total-kills"
                    value={newTotalKills}
                    onChange={(e) => setNewTotalKills(e.target.value)}
                    className=" w-4/5 md:w-3/5  p-1 mb-4 border rounded outline-none bg-black"
                  />
                </div>
              ) : (
                <div className="flex w-full justify-evenly md:justify-around">
                  <p>
                    {" "}
                    <span className="text-another-purple font-bold">
                      Score:
                    </span>{" "}
                    {team.score % 1 === 0 ? team.score : team.score.toFixed(1)}
                  </p>
                  <p>
                    <span className="text-another-purple font-bold">
                      Total Kills:
                    </span>{" "}
                    {team.totalKills}
                  </p>
                </div>
              )}

              <div>
                {isEditing === team.id ? (
                  <button title="Update">
                    <Check
                      onClick={() => handleUpdate(team.id)}
                      className="cursor-pointer stroke-another-green mr-4 md:mr-10"
                      size={30}
                    />
                  </button>
                ) : (
                  <button title="Edit">
                    <Pencil
                      size={19}
                      onClick={() => handleEdit(team)}
                      className="cursor-pointer stroke-another-purple"
                    />
                  </button>
                )}
              </div>
            </div>

            <ul className="pb-4 md:flex md:text-lg pl-4 md:pl-5 mt-6">
              {team.players.map((player, index) => (
                <li key={index} className="flex items-center">
                  <Dot size={25} className="stroke-another-green" />
                  {player}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
