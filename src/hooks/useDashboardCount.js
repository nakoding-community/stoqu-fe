import { useContext } from 'react';

import { DashboardContext } from '../contexts/DashboardCountContext';

const useDashboardCount = () => {
  const context = useContext(DashboardContext);

  return context;
};

export default useDashboardCount;
