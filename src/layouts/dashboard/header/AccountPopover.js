import { useState } from 'react';

import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, MenuItem, Avatar } from '@mui/material';

import useAuth from '../../../hooks/useAuth';

import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { logout, user } = useAuth();

  const [open, setOpen] = useState(null);

  const handleOpenHandler = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseHandler = () => {
    setOpen(null);
  };

  const logoutUserHandler = () => {
    logout();
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenHandler}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src="https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_23.jpg" alt={user?.name} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseHandler}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ m: 1 }} onClick={logoutUserHandler}>
          Keluar
        </MenuItem>
      </MenuPopover>
    </>
  );
}
