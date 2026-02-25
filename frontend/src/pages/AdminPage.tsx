import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { useActor } from '../hooks/useActor';

export default function AdminPage() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('adminToken'));
  const [validated, setValidated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('adminToken');
    if (!stored) {
      setChecking(false);
      setValidated(false);
      return;
    }
    if (!actor) return;
    actor.validateToken(stored).then((valid) => {
      if (valid) {
        setToken(stored);
        setValidated(true);
        if (location.pathname === '/admin') {
          navigate({ to: '/admin/dashboard' });
        }
      } else {
        sessionStorage.removeItem('adminToken');
        setToken(null);
        setValidated(false);
      }
      setChecking(false);
    }).catch(() => {
      setChecking(false);
    });
  }, [actor]);

  const handleLogin = (newToken: string) => {
    sessionStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setValidated(true);
    navigate({ to: '/admin/dashboard' });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setToken(null);
    setValidated(false);
    navigate({ to: '/admin' });
  };

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #080318 0%, #0f0530 50%, #080318 100%)' }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (validated && token) {
    return <AdminDashboard token={token} onLogout={handleLogout} />;
  }

  return <AdminLogin onLogin={handleLogin} />;
}
