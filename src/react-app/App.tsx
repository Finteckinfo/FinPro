import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import ProjectDetailPage from "@/react-app/pages/ProjectDetail";
import LoginPage from "@/react-app/pages/Login";
import { TokenSwap } from "@/react-app/pages/TokenSwap";
import ProtectedRoute from "@/react-app/components/ProtectedRoute";
import { WalletProvider } from "@/react-app/context/WalletContext";

export default function App() {
  return (
    <Router>
      <WalletProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/swap"
            element={
              <ProtectedRoute>
                <TokenSwap />
              </ProtectedRoute>
            }
          />
        </Routes>
      </WalletProvider>
    </Router>
  );
}
