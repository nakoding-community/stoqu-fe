import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import { LogoImageV3 } from '../assets';

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {
  const logo = <img src={LogoImageV3} alt="logo" style={{ width: '36px', height: '36px' }} />;

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
