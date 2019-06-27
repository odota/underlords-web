import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import constants from '../constants';

const StyledLink = styled(Link)`
  font-weight: ${constants.fontWeightMedium};
  color: ${constants.textColorPrimary};
  text-transform: uppercase;
  &:hover {
    color: ${constants.textColorPrimary};
    opacity: 0.6;
  }
`;

const AppLogo = ({ size, strings }) => (
  <StyledLink to="/">
    <span style={{ fontSize: size }}>
      {`<OpenUnderlords/>`}
    </span>
  </StyledLink>
);

AppLogo.propTypes = {
  size: PropTypes.string,
  strings: PropTypes.shape({}),
};

export default AppLogo;