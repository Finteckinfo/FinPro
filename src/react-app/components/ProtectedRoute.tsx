import { Navigate } from 'react-router';
import { useWallet } from '@/react-app/hooks/useWallet';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected, loading } = useWallet();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B18] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0D99FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-400 font-medium tracking-widest uppercase text-xs">Synchronizing Session...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
