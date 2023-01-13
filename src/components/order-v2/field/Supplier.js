import React from 'react';
import { shallow } from 'zustand/shallow';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';

const Supplier = () => {
  const { supplierId, trxType, immerSetState, labelText } = useCreateOrder(
    (state) => ({
      supplierId: state.payloadBody.supplierId,
      trxType: state.payloadBody.trxType,
      immerSetState: state.immerSetState,
      labelText: state.labelText.supplierName,
    }),
    shallow
  );

  const onChange = (e) => {
    immerSetState((draft) => {
      draft.payloadBody.supplierId = e?.id || '';
      draft.labelText.supplierName = e?.label || '';
    });
  };

  return (
    <InfiniteCombobox
      value={supplierId}
      label={`Supplier ${trxType === 'in' ? '(*)' : ''}`}
      sx={{ marginBottom: '20px' }}
      type="users"
      additionalQuery={{ filterRole: 'supplier' }}
      onChange={onChange}
      labelText={labelText}
    />
  );
};

export default Supplier;
