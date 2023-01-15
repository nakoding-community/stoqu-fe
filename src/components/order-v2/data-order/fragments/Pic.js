import React from 'react';
import { shallow } from 'zustand/shallow';
import InfiniteCombobox from '../../../combobox/InfiniteCombobox';
import { useCreateOrder } from '../../../../hooks/useCreateOrderV2';

const Pic = () => {
  const { picId, immerSetState, labelText } = useCreateOrder(
    (state) => ({
      picId: state.payloadBody.picId,
      immerSetState: state.immerSetState,
      labelText: state.labelText.picName,
    }),
    shallow
  );

  const onChange = (e) => {
    immerSetState((draft) => {
      draft.payloadBody.picId = e?.id || '';
      draft.labelText.picName = e?.label || '';
    });
  };

  return (
    <InfiniteCombobox
      value={picId}
      label="PIC (*)"
      sx={{ marginBottom: '20px' }}
      type="users"
      additionalQuery={{ filterRole: 'admin' }}
      onChange={onChange}
      labelText={labelText}
    />
  );
};

export default Pic;
