import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Badge, Typography, ListItemText, ListItemButton, Stack } from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';

// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { getReminderNotification, getUnreadCountNotification, readNotification } from '../../../client/reminderClient';
import { loadMoreValidator } from '../../../utils/helperUtils';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const [onLoadMore, setOnLoadMore] = useState(false);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const getUnReadCountHandler = async () => {
    const { data } = await getUnreadCountNotification();
    if (data) {
      setCount(data);
    }
  };

  const readNotificationHandler = async (data) => {
    const ids = data?.map((d) => d?.id);
    const { isSuccess } = await readNotification({ ids });
    if (isSuccess) {
      getUnReadCountHandler();
    }
  };

  const getReminderNotificationHandler = async (page) => {
    const query = {
      dscField: 'created_at',
      pageSize: 4,
      page,
    };
    const { data, meta } = await getReminderNotification(query);
    if (data) {
      setNotifications((prev) => [...prev, ...data]);
      readNotificationHandler(data);
      setTotalPage(meta?.info?.totalPage);
    }
  };

  const onScrollHandler = (e) => {
    const target = e.currentTarget;

    if (currentPage < totalPage && !onLoadMore) {
      loadMoreValidator(target, 30, async () => {
        setOnLoadMore(true);
        await getReminderNotificationHandler(currentPage + 1);
        setCurrentPage(currentPage + 1);
        setOnLoadMore(false);
      });
    }
  };

  useEffect(() => {
    if (open) {
      getReminderNotificationHandler(currentPage);
    } else {
      setTimeout(() => {
        setNotifications([]);
        setTotalPage(0);
        setCurrentPage(1);
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    getUnReadCountHandler();
  }, []);

  return (
    <>
      <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={count} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Scrollbar sx={{ maxHeight: { sm: '320px' } }} onScroll={onScrollHandler}>
          {notifications?.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationItem key={`${notification.id}+${index}`} notification={notification} />
            ))
          ) : (
            <Stack sx={{ p: 2 }}>No notification</Stack>
          )}
        </Scrollbar>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const navigate = useNavigate();
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
      }}
      onClick={() => navigate(`/dashboard/stock`)}
    >
      <ListItemText
        primary={
          <Typography variant="subtitle2">
            {notification?.title}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              &nbsp; {notification?.body}
            </Typography>
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}
