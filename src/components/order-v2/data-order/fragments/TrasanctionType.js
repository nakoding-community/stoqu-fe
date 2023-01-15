import React from 'react';
import { shallow } from 'zustand/shallow';
import InfiniteCombobox from '../../../combobox/InfiniteCombobox';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

const TrasanctionType = () => {
  const { trxType, immerSetState } = useCreateOrder(
    (state) => ({
      trxType: state.payloadBody.trxType,
      immerSetState: state.immerSetState,
    }),
    shallow
  );

  return (
    <InfiniteCombobox
      value={trxType}
      label="Tipe Transaksi (*)"
      sx={{ marginBottom: '20px' }}
      type="typeTransaction"
      useStaticOption
      staticOptions={[
        { id: 'in', label: 'Masuk' },
        { id: 'out', label: 'Keluar' },
      ]}
      onChange={(e) =>
        immerSetState((draft) => {
          draft.payloadBody.trxType = e.id;
        })
      }
      // disabled={!isCreatePage || !isUserAbleToEdit}
    />
  );
};

export default TrasanctionType;
