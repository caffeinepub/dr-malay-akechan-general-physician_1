import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  token: string | null;
  setAdminToken: (token: string) => void;
  clearAdmin: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  token: null,
  setAdminToken: () => {},
  clearAdmin: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('adminToken'));

  const setAdminToken = (t: string) => {
    sessionStorage.setItem('adminToken', t);
    setToken(t);
  };

  const clearAdmin = () => {
    sessionStorage.removeItem('adminToken');
    setToken(null);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('adminToken');
    if (stored) setToken(stored);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin: !!token, token, setAdminToken, clearAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
