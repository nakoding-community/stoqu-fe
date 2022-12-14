import { useContext } from 'react';

import { CreateOrderContext } from '../contexts/CreateOrderContext';

const useCreateOrder = () => {
  const context = useContext(CreateOrderContext);

  return context;
};

export default useCreateOrder;
