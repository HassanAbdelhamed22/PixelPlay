import { Routes, Route } from "react-router-dom";
import AboutPage from "./pages/About";
import GamesPage from "./pages/Games";
import HomePage from "./pages/Index";
import GameDetails from "./pages/GameDetails";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import { Toaster } from "./components/ui/toaster";
import AppLayout from "./layout/AppLayout";
import { token } from "./constant";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/dashboard/Index";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardGames from "./pages/dashboard/DashboardGames";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Route */}
          <Route
            path="/login"
            element={<LoginPage isAuthenticated={token} />}
          />

          {/* Fallback route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="games" element={<DashboardGames />} />
          <Route
            path="categories"
            element={<div>Admin Categories Management (Coming Soon)</div>}
          />
          <Route
            path="support"
            element={<div>Admin Support Management (Coming Soon)</div>}
          />

          {/* Fallback route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
