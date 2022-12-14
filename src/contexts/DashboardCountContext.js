import { createContext, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getDashboardCommon } from '../client/dashboardClient';

const DashboardContext = createContext({});

const DashboardContextProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [dashboardCount, setDashboardCount] = useState({});

  const getDashboardCommonHandler = async () => {
    const { data } = await getDashboardCommon();
    if (data) {
      setDashboardCount(data);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getDashboardCommonHandler();
    }
  }, [isAuthenticated]);

  return <DashboardContext.Provider value={{ ...dashboardCount }}>{children}</DashboardContext.Provider>;
};

export { DashboardContext, DashboardContextProvider };
