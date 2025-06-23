import { Routes, Route } from "react-router-dom";
import AboutPage from "./pages/About";
import GamesPage from "./pages/Games";
import HomePage from "./pages/Index";
import GameDetails from "./pages/GameDetails";
import Navbar from "./layout/Navbar";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Fallback route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
