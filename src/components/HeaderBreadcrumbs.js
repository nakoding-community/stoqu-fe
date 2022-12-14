import isString from 'lodash/isString';
import PropTypes from 'prop-types';
// @mui
import { Box, Typography, Link } from '@mui/material';
import Label from './Label';

// ----------------------------------------------------------------------

HeaderBreadcrumbs.propTypes = {
  action: PropTypes.node,
  heading: PropTypes.string.isRequired,
  moreLink: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  sx: PropTypes.object,
  useBadge: PropTypes.bool,
};

export default function HeaderBreadcrumbs({ action, heading, moreLink = '' || [], sx, useBadge, badgeCount }) {
  return (
    <Box sx={{ mb: 4, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ marginRight: '8px' }}>
            {heading}
          </Typography>
          {useBadge && (
            <Label variant="ghost" color="error">
              {badgeCount}
            </Label>
          )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>

      <Box sx={{ mt: 2 }}>
        {isString(moreLink) ? (
          <Link href={moreLink} target="_blank" rel="noopener" variant="body2">
            {moreLink}
          </Link>
        ) : (
          moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))
        )}
      </Box>
    </Box>
  );
}
