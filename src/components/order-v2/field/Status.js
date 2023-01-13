import React, { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useConfirm } from 'material-ui-confirm';
import startCase from 'lodash/startCase';
import { Box, Typography } from '@mui/material';
import InfiniteCombobox from '../../combobox/InfiniteCombobox';
import Label from '../../Label';
import { getStatusColor } from '../../../utils/helperUtils';
import { useCreateOrder } from '../../../hooks/useCreateOrderV2';

const Status = () => {
  const [showCombobox, setShowCombobox] = useState(false);

  const confirm = useConfirm();

  const { status, immerSetState } = useCreateOrder(
    (state) => ({
      status: state.payloadBody.status,
      immerSetState: state.immerSetState,
    }),
    shallow
  );

  const onChange = (e) => {
    immerSetState((draft) => {
      draft.payloadBody.status = e?.id || '';
    });
  };

  return (
    <Box>
      {showCombobox ? (
        <InfiniteCombobox
          label="Status"
          autoFocus
          onBlur={() => setShowCombobox(!showCombobox)}
          useStaticOption
          staticOptions={[
            { id: 'PROGRESS', label: 'Progress' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'COMPLETED', label: 'Complete' },
          ]}
          open
          onChange={onChange}
        />
      ) : (
        <>
          <Typography variant="body1">Status</Typography>
          <Label variant="ghost" color={getStatusColor(status)} onClick={() => setShowCombobox(!showCombobox)}>
            {startCase(status)}
          </Label>
        </>
      )}
    </Box>
  );
};

export default Status;
