"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
} from "firebase/firestore";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import { GameModel, GameStatus, PrizeDistribution } from "../model/game_model";

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<GameModel[]>([]);
  const [showNewGameForm, setShowNewGameForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ticketPrice: 2.0,
    ticketCurrency: "$",
    startTime: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    ticketLimit: 10,
    prizeDistribution: {
      platformChargePercentage: 10,
      fullHousePrizePercentage: 40,
      fourCornersPrizePercentage: 20,
      rowPrizePercentage: 20,
      earlyFivePrizePercentage: 10,
    },
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        fetchGames();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchGames = async () => {
    try {
      const gamesCollection = collection(db, "games");
      const q = query(
        gamesCollection,
        where("status", "==", "waiting"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const gamesData: GameModel[] = [];
      querySnapshot.forEach((doc) => {
        gamesData.push(GameModel.fromJson(doc.data()));
      });

      setGames(gamesData);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrizeDistributionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      prizeDistribution: {
        ...prev.prizeDistribution,
        [name]: parseFloat(value),
      },
    }));
  };

  // Validate that prize distribution percentages sum to 90% (with 10% platform charge)
  const validatePrizeDistribution = (): boolean => {
    const {
      fullHousePrizePercentage,
      fourCornersPrizePercentage,
      rowPrizePercentage,
      earlyFivePrizePercentage,
    } = formData.prizeDistribution;
    const sum =
      fullHousePrizePercentage +
      fourCornersPrizePercentage +
      rowPrizePercentage +
      earlyFivePrizePercentage;

    // The sum should be 90 (because 10% is platform charge)
    return Math.abs(sum - 90) < 0.01; // Using a small epsilon for floating point comparison
  };

  const handleStartNewGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to start a new game.");
      return;
    }

    if (!validatePrizeDistribution()) {
      alert(
        "Prize distribution percentages must sum to 90% (with 10% platform charge)."
      );
      return;
    }

    try {
      const newGame = GameModel.create(user.uid);

      // Update with form data
      newGame.name = formData.name;
      newGame.description = formData.description;
      newGame.ticketPrice = formData.ticketPrice;
      newGame.ticketCurrency = formData.ticketCurrency;
      newGame.startTime = new Date(formData.startTime);
      newGame.ticketLimit = formData.ticketLimit;
      newGame.status = GameStatus.waiting;
      newGame.prizeDistribution = new PrizeDistribution({
        platformChargePercentage: 20,
        fullHousePrizePercentage: 50,
        fourCornersPrizePercentage: 7,
        rowPrizePercentage: 36,
        earlyFivePrizePercentage: 7,
      });
      newGame.prizeDistribution.platformChargePercentage =
        formData.prizeDistribution.platformChargePercentage;
      newGame.prizeDistribution.fullHousePrizePercentage =
        formData.prizeDistribution.fullHousePrizePercentage;
      newGame.prizeDistribution.fourCornersPrizePercentage =
        formData.prizeDistribution.fourCornersPrizePercentage;
      newGame.prizeDistribution.rowPrizePercentage =
        formData.prizeDistribution.rowPrizePercentage;
      newGame.prizeDistribution.earlyFivePrizePercentage =
        formData.prizeDistribution.earlyFivePrizePercentage;

      const gamesCollection = collection(db, "games");
      await addDoc(gamesCollection, newGame.toJson());

      // Refresh the games list
      fetchGames();
      setShowNewGameForm(false); // Close the form
      alert("New game created successfully!");
    } catch (error) {
      console.error("Error creating new game:", error);
      alert("Failed to create a new game. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white">
      <header className="bg-black/30 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Tambola
            </div>
            <div className="flex space-x-4">
              <Link href="/profile">
                <button className="bg-purple-700 px-4 py-2 rounded-full hover:bg-purple-600 transition-all hover:scale-105">
                  Profile
                </button>
              </Link>
              <Link href="/">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:scale-105 transition-all">
                  Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Welcome to your Dashboard
          </h1>

          <div className="mb-8 p-6 bg-purple-900/40 rounded-lg backdrop-blur-sm shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-purple-200">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-800/30 rounded-lg">
                <p className="text-gray-300 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.243 5.757a6 6 0 10-8.486 8.486 6 6 0 008.486-8.486zm-1.414 1.414a4 4 0 11-5.657 5.657 4 4 0 015.657-5.657z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M9 3.5A5.5 5.5 0 103.5 9 5.5 5.5 0 009 3.5zm0 8a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
              </div>
              <div className="p-4 bg-purple-800/30 rounded-lg">
                <p className="text-gray-300 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">User ID:</span> {user?.uid}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-indigo-900/40 p-6 rounded-xl shadow-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-indigo-200">
                  Recent Games
                </h3>
                <button
                  onClick={() => setShowNewGameForm(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Start New Game
                </button>
              </div>

              {games.length === 0 ? (
                <div className="text-center py-12 bg-indigo-800/20 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-indigo-300 opacity-70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-400 mt-4">
                    No recent games found. Start your first game!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="bg-indigo-800/40 p-5 rounded-lg border border-indigo-700/50 hover:border-indigo-500 transition-all shadow-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-lg text-indigo-100">
                          {game.name || game.id}
                        </h4>
                        <span className="px-3 py-1 text-xs rounded-full bg-indigo-700 text-white">
                          {game.status}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                        {game.description || "No description available"}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                        <p className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-indigo-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Host: {game.hostId.substring(0, 8)}...
                        </p>
                        <p className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-indigo-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Price: {game.ticketCurrency}
                          {game.ticketPrice}
                        </p>
                        <p className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-indigo-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Created: {game.createdAt.toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-indigo-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Starts:{" "}
                          {game.startTime?.toLocaleString() || "Not set"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-400">
                          Players: {game.players.length}/{game.ticketLimit}
                        </p>
                        <Link href={`/game/${game.id}`}>
                          <button className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-500 transition-colors text-sm flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            View Game
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-indigo-900/40 p-6 rounded-xl shadow-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6 text-indigo-200">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-800/30 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">Total Games</p>
                  <p className="text-3xl font-bold text-indigo-200">
                    {games.length}
                  </p>
                </div>
                <div className="bg-indigo-800/30 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">Games Hosted</p>
                  <p className="text-3xl font-bold text-indigo-200">
                    {games.filter((g) => g.hostId === user?.uid).length}
                  </p>
                </div>
                <div className="bg-indigo-800/30 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">Games Won</p>
                  <p className="text-3xl font-bold text-indigo-200">--</p>
                </div>
                <div className="bg-indigo-800/30 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">Tickets Bought</p>
                  <p className="text-3xl font-bold text-indigo-200">--</p>
                </div>
              </div>

              <div className="bg-indigo-800/20 p-5 rounded-lg border border-indigo-700/50">
                <h4 className="text-lg font-medium mb-4 text-indigo-200">
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  {games.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                      No recent activity to display.
                    </p>
                  ) : (
                    games.slice(0, 3).map((game, idx) => (
                      <div
                        key={`activity-${idx}`}
                        className="flex items-start gap-3 p-2 rounded-lg bg-indigo-800/20"
                      >
                        <div className="bg-indigo-700 h-8 w-8 rounded-full flex items-center justify-center text-white">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-indigo-100 text-sm">
                            {game.name || `Game #${game.id.substring(0, 6)}`}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {game.createdAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Game Form Modal */}
      {showNewGameForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-900/90 backdrop-blur-lg py-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Create New Game
              </h2>
              <button
                onClick={() => setShowNewGameForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleStartNewGame} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Game Information */}
                <div className="md:col-span-2 p-4 bg-indigo-900/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-indigo-200">
                    Game Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm font-medium">
                        Game Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                        placeholder="Enter a catchy name for your game"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm font-medium">
                        Game Description*
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                        placeholder="Describe your game, rules, and other details"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Ticket Information */}
                <div className="p-4 bg-indigo-900/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-indigo-200">
                    Ticket Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm font-medium">
                        Ticket Price*
                      </label>
                      <div className="flex">
                        <select
                          name="ticketCurrency"
                          value={formData.ticketCurrency}
                          onChange={handleInputChange}
                          className="p-3 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                        >
                          <option value="$">$</option>
                          <option value="₹">₹</option>
                        </select>
                        <input
                          type="number"
                          name="ticketPrice"
                          value={formData.ticketPrice}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-r-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                          placeholder="Enter ticket price"
                          min="0.1"
                          step="0.1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm font-medium">
                        Ticket Limit*
                      </label>
                      <input
                        type="number"
                        name="ticketLimit"
                        value={formData.ticketLimit}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                        placeholder="Maximum number of tickets"
                        min="2"
                        max="100"
                        required
                      />
                      <p className="text-gray-400 text-xs mt-1">
                        Maximum number of players allowed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Game Schedule */}
                <div className="p-4 bg-indigo-900/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-indigo-200">
                    Game Schedule
                  </h3>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">
                      Start Time*
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                      required
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      When will the game begin?
                    </p>
                  </div>
                </div>

                {/* Prize Distribution */}
                <div className="md:col-span-2 p-4 bg-indigo-900/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-indigo-200">
                    Prize Distribution
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-indigo-800/30 p-3 rounded-lg mb-4">
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium">Note:</span> Platform fee
                        is fixed at 10%. The remaining 90% will be distributed
                        as prizes. Percentages must add up to 90%.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm font-medium">
                          Full House Prize (%)*
                        </label>
                        <input
                          type="number"
                          name="fullHousePrizePercentage"
                          value={
                            formData.prizeDistribution.fullHousePrizePercentage
                          }
                          onChange={handlePrizeDistributionChange}
                          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                          min="0"
                          max="90"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm font-medium">
                          Four Corners Prize (%)*
                        </label>
                        <input
                          type="number"
                          name="fourCornersPrizePercentage"
                          value={
                            formData.prizeDistribution
                              .fourCornersPrizePercentage
                          }
                          onChange={handlePrizeDistributionChange}
                          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                          min="0"
                          max="90"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm font-medium">
                          Row Prize (%)*
                        </label>
                        <input
                          type="number"
                          name="rowPrizePercentage"
                          value={formData.prizeDistribution.rowPrizePercentage}
                          onChange={handlePrizeDistributionChange}
                          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                          min="0"
                          max="90"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm font-medium">
                          Early Five Prize (%)*
                        </label>
                        <input
                          type="number"
                          name="earlyFivePrizePercentage"
                          value={
                            formData.prizeDistribution.earlyFivePrizePercentage
                          }
                          onChange={handlePrizeDistributionChange}
                          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                          min="0"
                          max="90"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            Math.abs(
                              formData.prizeDistribution
                                .fullHousePrizePercentage +
                                formData.prizeDistribution
                                  .fourCornersPrizePercentage +
                                formData.prizeDistribution.rowPrizePercentage +
                                formData.prizeDistribution
                                  .earlyFivePrizePercentage -
                                90
                            ) < 0.01
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${
                              formData.prizeDistribution
                                .fullHousePrizePercentage +
                              formData.prizeDistribution
                                .fourCornersPrizePercentage +
                              formData.prizeDistribution.rowPrizePercentage +
                              formData.prizeDistribution
                                .earlyFivePrizePercentage
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0%</span>
                        <span>
                          Total:{" "}
                          {(
                            formData.prizeDistribution
                              .fullHousePrizePercentage +
                            formData.prizeDistribution
                              .fourCornersPrizePercentage +
                            formData.prizeDistribution.rowPrizePercentage +
                            formData.prizeDistribution.earlyFivePrizePercentage
                          ).toFixed(2)}
                          % (should be 90%)
                        </span>
                        <span>90%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowNewGameForm(false)}
                  className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all text-white font-medium"
                >
                  Create Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.8);
        }
      `}</style>
    </div>
  );
}

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
