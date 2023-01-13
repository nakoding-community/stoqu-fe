import { createContext, useRef, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import produce from 'immer';

import { devtools } from 'zustand/middleware';

const createBearStore = (initProps) => {
  const DEFAULT_PROPS = {
    payloadBody: {
      customerId: '',
      finalPrice: 0,
      id: '',
      isRead: false,
      items: [],
      notes: '',
      paymentStatus: '',
      picId: '',
      price: 0,
      receipts: [],
      shipmentNumber: '',
      shipmentPrice: 0,
      shipmentType: '',
      status: 'PROGRESS',
      stockStatus: '',
      supplierId: '',
      trxType: '',
    },
    labelText: {
      customerName: '',
      supplierName: '',
      picName: '',
    },
  };

  return createStore(
    devtools((set, get) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      immerSetState: (newState) => {
        set((currentState) => produce(currentState, newState));
      },
    }))
  );
};

const CreateOrderContext = createContext();

const CreateOrderProvider = ({ children, ...props }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createBearStore(props);
  }
  return <CreateOrderContext.Provider value={storeRef.current}>{children}</CreateOrderContext.Provider>;
};

const useCreateOrder = (selector, equalityFn) => {
  const store = useContext(CreateOrderContext);

  if (!store) throw new Error('Missing CreateOrderProvider in the tree');

  return useStore(store, selector, equalityFn);
};

export { CreateOrderProvider, useCreateOrder };
