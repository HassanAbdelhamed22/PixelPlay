import { Routes, Route } from "react-router-dom";
import AboutPage from "./pages/About";
import GamesPage from "./pages/Games";
import HomePage from "./pages/Index";
import GameDetails from "./pages/GameDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

export default App;
