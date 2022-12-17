/* eslint-disable array-callback-return */
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Badge, Typography, ListItemText, ListItemButton, Stack } from '@mui/material';
// utils
import flatten from 'lodash/flatten';
import { fToNow } from '../../../utils/formatTime';

// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { loadMoreValidator } from '../../../utils/helperUtils';
import {
  useBulkReadReminderStockHistories,
  useGetReminderStockHistories,
  useGetUnreadCountStockHistories,
} from '../../../hooks/api/useReminderStockHistory';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(null);

  // ** Hook to update unread notification data to read
  const { mutate: bulkUnReadNotifications } = useBulkReadReminderStockHistories();

  const notificationsParams = {
    pageSize: 4,
    page: 1,
  };

  // ** Get notifications data
  const {
    data: notificationsData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetReminderStockHistories(notificationsParams, {
    enabled: Boolean(open),
    onSuccess: (data) => {
      const notifications = flatten(
        data?.pages?.map((page) => {
          return page?.data?.map((d) => {
            return d;
          });
        })
      );

      const unReadNotifications = notifications?.filter((notification) => !notification?.isRead);

      if (unReadNotifications?.length > 0) {
        const body = {
          ids: unReadNotifications?.map((notification) => notification?.id),
        };

        bulkUnReadNotifications(body, {
          onSuccess: () => {
            // ** Refetch notifications un-read count data
            queryClient.refetchQueries(['reminder-stock-histories', 'unread', 'count']);
          },
        });
      }
    },
  });

  // ** Mapping notifications data
  const notifications = flatten(
    notificationsData?.pages?.map((page) => {
      return page?.data?.map((d) => {
        return d;
      });
    })
  );

  // ** Get unread notifications data
  const { data: unReadNotificationsCountData } = useGetUnreadCountStockHistories();

  // ** Unread notifications count
  const unReadNotificationsCount = unReadNotificationsCountData?.data?.count;

  // ** Handle load more notifications
  const onScrollHandler = (e) => {
    const target = e.currentTarget;

    if (hasNextPage && !isFetchingNextPage) {
      loadMoreValidator(target, 30, async () => {
        fetchNextPage();
      });
    }
  };

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={(e) => setOpen(e.currentTarget)}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={unReadNotificationsCount} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => setOpen(null)}
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
