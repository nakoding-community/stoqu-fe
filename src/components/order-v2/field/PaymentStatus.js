import React from 'react';
import { shallow } from 'zustand/shallow';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';

const PaymentStatus = () => {
  const { paymentStatus, immerSetState } = useCreateOrder(
    (state) => ({
      paymentStatus: state.payloadBody.paymentStatus,
      immerSetState: state.immerSetState,
    }),
    shallow
  );

  const onChange = (e) => {
    immerSetState((draft) => {
      draft.payloadBody.paymentStatus = e?.id || '';
    });
  };

  return (
    <InfiniteCombobox
      value={paymentStatus}
      label="Status Pembayaran (*)"
      sx={{ marginBottom: '20px' }}
      useStaticOption
      staticOptions={[
        { id: 'PAID', label: 'Lunas' },
        { id: 'DP', label: 'Down Payment (DP)' },
        { id: 'UNPAID', label: 'Belum Dibayar' },
      ]}
      onChange={onChange}
    />
  );
};

export default PaymentStatus;
