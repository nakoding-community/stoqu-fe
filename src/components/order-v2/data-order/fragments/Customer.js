import React from 'react';
import { shallow } from 'zustand/shallow';
import InfiniteCombobox from '../../../combobox/InfiniteCombobox';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

const Customer = () => {
  const { customerId, trxType, immerSetState, labelText } = useCreateOrder(
    (state) => ({
      customerId: state.payloadBody.customerId,
      trxType: state.payloadBody.trxType,
      immerSetState: state.immerSetState,
      labelText: state.labelText.customerName,
    }),
    shallow
  );

  const onChange = (e) => {
    immerSetState((draft) => {
      draft.payloadBody.customerId = e?.id || '';
      draft.labelText.customerName = e?.label || '';
    });
  };

  return (
    <InfiniteCombobox
      value={customerId}
      label={`Customer ${trxType === 'out' ? '(*)' : ''}`}
      sx={{ marginBottom: '20px' }}
      type="users"
      additionalQuery={{ filterRole: 'customer' }}
      onChange={onChange}
      useCreateOnEnter
      labelText={labelText}
    />
  );
};

export default Customer;
