"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Team } from "@/types";
import LoginHeader from "@/components/LoginHeader";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Team[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsCollection = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollection);
      const teamsList = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Team[];
      setTeams(teamsList.sort((a, b) => b.score - a.score));
      setFilteredPlayers(teamsList.sort((a, b) => b.score - a.score));
      setLoading(false);
    };

    fetchTeams();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    if (lowerCaseQuery === "") {
      setFilteredPlayers(teams);
    } else {
      const filtered = teams.filter((team) =>
        team.players.some((player) =>
          player.toLowerCase().includes(lowerCaseQuery)
        )
      );
      setFilteredPlayers(filtered);
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen">
      <header className="w-full px-6 border-b-2 border-purple-dark flex py-8 justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-white">UAI Game</h1>
        <button
          onClick={toggleMenu}
          className="md:hidden text-white font-medium"
        >
          Admin
        </button>
        <div className="hidden md:block">
          <LoginHeader />
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden">
          <LoginHeader />
        </div>
      )}
      <main className="md:mt-8 mb-8 mt-4 text-black w-full flex flex-col justify-center px-4">
        <h2 className="text-4xl font-bold my-6 text-center text-white">
          Results Tracker
        </h2>
        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="h-7 w-7 mb-4 border-4 self-center border-gray-500 border-l-sky-400 border-t-sky-400 animate-spin rounded-full"></div>
          </div>
        ) : (
          <div className="flex flex-col">
            <table className="border-separate">
              <thead className="text-sm">
                <tr className=" text-black bg-another-purple uppercase ">
                  <th className="px-1 md:py-2">Rank</th>
                  <th className="">Team</th>
                  <th className="">Score</th>
                  <th className="">Total Kills</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((team, index) => (
                  <tr
                    key={team.id}
                    className="text-center bg-gray-500/40 text-white"
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4 md:flex md:justify-center">
                      {team.players.join(", ")}
                    </td>
                    <td className="py-2 px-4">{team.score}</td>
                    <td className="py-2 px-4">{team.totalKills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
