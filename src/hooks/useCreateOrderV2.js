import { createContext, useRef, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import produce from 'immer';
import parseInt from 'lodash/parseInt';

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
      stockStatus: 'NORMAL',
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
      getTotalProductAmount: () => {
        const items = get().payloadBody?.items || [];

        return items?.reduce((curr, array) => curr + parseInt(array?.total), 0);
      },
      getTotalProductPrice: () => {
        const items = get().payloadBody?.items || [];

        return items?.reduce((curr, array) => curr + parseInt(array?.price), 0);
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
