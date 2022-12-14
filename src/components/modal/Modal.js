import React from 'react';
import PropTypes from 'prop-types';
import { DialogTitle, Box, Button } from '@mui/material';

import { DialogAnimate } from '../animate';

import Label from '../Label';
import Iconify from '../Iconify';

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.string,
};

function Modal({ title, open, onClose, maxWidth, children, badgeCount, useBadge, headerButtonComponent }) {
  return (
    <DialogAnimate open={open} onClose={onClose} maxWidth={maxWidth}>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            {title}{' '}
            {useBadge && (
              <Label variant="ghost" color="error" sx={{ marginLeft: '8px' }}>
                {badgeCount}
              </Label>
            )}
          </Box>
          {headerButtonComponent && headerButtonComponent}
          {/* {headerButton && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon={headerButton?.iconName} />}
              onClick={(e) => headerButton?.onClick && headerButton?.onClick(e)}
            >
              {headerButton?.text}
            </Button>
          )} */}
        </DialogTitle>
      </Box>

      {children}
    </DialogAnimate>
  );
}

export default Modal;
