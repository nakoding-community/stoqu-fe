import React from 'react';

import PropTypes from 'prop-types';
import { DialogTitle, Box, Button } from '@mui/material';

import { DialogAnimate } from '../animate';

import Label from '../Label';
import Iconify from '../Iconify';

const ModalV2 = ({ open, onClose, maxWidth, children }) => {
  return (
    <DialogAnimate open={open} onClose={onClose} maxWidth={maxWidth}>
      {children}
    </DialogAnimate>
  );
};

const Header = ({ children }) => {
  return <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>{children}</Box>;
};

const Content = ({ children }) => {
  return <>{children}</>;
};

ModalV2.Content = Content;
ModalV2.Header = Header;

export default ModalV2;
