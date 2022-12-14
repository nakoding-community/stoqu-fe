import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createContext, useEffect, useState } from 'react';
import {
  getOrderDetail,
  createOrder,
  updateOrder,
  createOrderProduct,
  deleteOrderProduct,
  syncProductOrder,
  cancelOrder,
} from '../client/ordersClient';
import { getOrderSync } from '../client/stocksClient';

import { useForm } from '../hooks/useForm';

const CreateOrderContext = createContext({});

const CreateOrderContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isCreatePage = location.pathname.includes('new');

  const initialFormInput = {
    trxType: '',
    customerId: '',
    supplierId: '',
    picId: '',
    price: '',
    paymentStatus: '',
    receipts: [],
    shipmentType: '',
    shipmentNumber: '',
    shipmentPrice: '',
    stockStatus: 'normal',
    status: 'progress',
    items: [],
  };

  const [createOrderState, changeCreateOrderState, setFormData] = useForm(initialFormInput);

  const [detailOrderState, setDetailOrderState] = useState({});
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const totalProductAmount = createOrderState?.items?.reduce((curr, array) => curr + array?.quantity, 0);
  const totalProductPrice = createOrderState?.items?.reduce((curr, array) => curr + array?.price, 0);

  const totalPrice = parseFloat(totalProductPrice) + parseFloat(createOrderState?.shipmentPrice || 0);

  const isUserAbleToEdit = createOrderState?.status !== 'canceled';

  const checkStockStatus = () => {
    const isAbnormal =
      createOrderState?.items?.filter((item) => item?.stock === 'not_available' || item?.stock === 'need_convert')
        ?.length > 0;

    changeCreateOrderState('stockStatus', isAbnormal ? 'abnormal' : 'normal');
  };

  const getDetailOrderHandler = async () => {
    const { data: orderDetail } = await getOrderDetail(id);
    const { data: orderSync } =
      orderDetail?.items?.length > 0 ? await getOrderSync({ orderTrxId: orderDetail?.id }) : {};

    if (orderDetail) {
      // Set Detail Order State for displaying data
      setDetailOrderState({
        ...orderDetail,
        items: orderDetail?.items?.map((item) => {
          const isOrderSync =
            orderSync?.items?.find((syncItem) => syncItem?.orderTrxItemId === item?.id)?.isOrderSync || false;
          return {
            ...item,
            isOrderSync,
          };
        }),
      });

      // Set form data to send to backend
      setFormData({
        trxType: orderDetail?.trxType,
        customerId: orderDetail?.customerId,
        supplierId: orderDetail?.supplierId,
        picId: orderDetail?.picId,
        price: parseFloat(totalProductPrice),
        finalPrice: totalPrice,
        paymentStatus: orderDetail?.paymentStatus,
        receipts: orderDetail?.receipts,
        shipmentType: orderDetail?.shipmentType,
        shipmentNumber: orderDetail?.shipmentNumber,
        shipmentPrice: parseFloat(orderDetail?.shipmentPrice),
        stockStatus: orderDetail?.stockStatus,
        items: orderDetail?.items?.map((item) => {
          return {
            id: item?.id,
            brand: item?.brand,
            price: parseFloat(item?.price),
            productId: item?.productId,
            quantity: parseFloat(item?.quantity),
            stock: item?.stock,
            type: item?.type,
            variant: item?.variant,
          };
        }),
        status: orderDetail?.status,
        labelText: {
          customerName: orderDetail?.customerName,
          supplierName: orderDetail?.supplierName,
          picName: orderDetail?.picName,
        },
        notes: orderDetail?.notes,
      });

      setIsReady(true);
    }
  };

  const changeLabelText = (newObjValue) => {
    changeCreateOrderState('labelText', {
      ...createOrderState.labelText,
      ...newObjValue,
    });
  };

  const processOrderHandler = async (id, withSuccessMessage = true) => {
    const body = {
      ...createOrderState,
      price: totalPrice,
      finalPrice: totalPrice,
      shipmentPrice: parseFloat(createOrderState?.shipmentPrice || 0),
    };

    // do not need to send items & labelText when edit
    if (!isCreatePage) {
      delete body.items;
      delete body.labelText;
    }

    const { isSuccess } = isCreatePage ? await createOrder(body) : await updateOrder(id, body);
    if (isSuccess) {
      if (withSuccessMessage) {
        toast.success(`Berhasil ${isCreatePage ? 'membuat' : 'mengubah'} pesanan`);
      }
      // eslint-disable-next-line no-unused-expressions
      if (isCreatePage) {
        navigate('/dashboard/order');
      } else {
        getDetailOrderHandler();
        return isSuccess;
      }
    }
  };

  const createProductHandler = async (body) => {
    if (isCreatePage) {
      const copyItems = [...createOrderState.items];
      changeCreateOrderState('items', [...copyItems, body]);
      toast.success('Berhasil menambahkan produk');
    } else {
      const { data } = await createOrderProduct(body);
      const isSuccess = await processOrderHandler(detailOrderState?.id, false);
      if (data && isSuccess) {
        toast.success('Berhasil menambahkan produk');
      }
    }
  };

  const deleteProductHandler = async (deleteIndex, deleteId) => {
    if (isCreatePage) {
      const newProducts = [...createOrderState.items];
      newProducts.splice(deleteIndex, 1);
      changeCreateOrderState('items', newProducts);
      toast.success('Berhasil menghapus produk');
    } else {
      const { isSuccess: isSuccessDeleteProduct } = await deleteOrderProduct(deleteId);
      const isSuccess = await processOrderHandler(detailOrderState?.id, false);
      if (isSuccessDeleteProduct && isSuccess) {
        toast.success('Berhasil menghapus produk');
      }
    }
  };

  const syncProductOrderHandler = async (orderTrxItemId) => {
    const { data } = await syncProductOrder(detailOrderState?.id, orderTrxItemId);
    if (data) {
      toast.success('Berhasil mengsinkronisasi produk');
      getDetailOrderHandler();
    }
  };

  const cancelOrderHandler = async () => {
    const { isSuccess } = await cancelOrder(detailOrderState?.id);
    if (isSuccess) {
      getDetailOrderHandler();
    }
  };

  useEffect(() => {
    if (!isCreatePage) {
      getDetailOrderHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatePage]);

  useEffect(() => {
    checkStockStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createOrderState?.items]);

  const checkListRequiredInput = () => {
    const listRequiredInput = [
      {
        id: 'trxType',
        required: true,
      },
      {
        id: 'customerId',
        required: createOrderState.trxType === 'out',
      },
      {
        id: 'supplierId',
        required: createOrderState.trxType === 'in',
      },
      {
        id: 'picId',
        required: true,
      },
      {
        id: 'paymentStatus',
        required: true,
      },
    ];

    let isAbleToSubmit = true;
    listRequiredInput.forEach((input) => {
      if (input.required) {
        if (!createOrderState[input.id]) {
          isAbleToSubmit = false;
        }
      }
    });
    setIsAbleToSubmit(isAbleToSubmit);
  };

  useEffect(() => {
    checkListRequiredInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createOrderState]);

  const value = {
    detailOrderState,
    createOrderState,
    changeCreateOrderState,
    setFormData,
    processOrderHandler,
    createProductHandler,
    deleteProductHandler,
    syncProductOrderHandler,
    cancelOrderHandler,
    changeLabelText,
    totalProductAmount,
    totalProductPrice,
    totalPrice,
    isCreatePage,
    isUserAbleToEdit,
    isAbleToSubmit,
    isReady,
  };

  return <CreateOrderContext.Provider value={{ ...value }}>{children}</CreateOrderContext.Provider>;
};

export { CreateOrderContext, CreateOrderContextProvider };
