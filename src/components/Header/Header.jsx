import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import Bug from 'material-ui/svg-icons/action/bug-report';
import styled from 'styled-components';
import Dropdown from '../Header/Dropdown';
import constants from '../constants';
import AppLogo from '../App/AppLogo';
import BurgerMenu from './BurgerMenu';
import LocalizationMenu from '../LocalizationMenu/LocalizationMenu';
import { MediaQuery } from 'react-responsive';

const REPORT_BUG_PATH = `//github.com/odota/underlords-ui/issues`;

const VerticalAlignToolbar = styled(ToolbarGroup)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDropdown = styled(Dropdown)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BugLink = styled.a`
  font-size: ${constants.fontSizeMedium};
  font-weight: ${constants.fontWeightLight};
  color: ${constants.colorMutedLight} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;
  & svg {
    margin-right: 5px;
    /* Override material-ui */
    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
  }
`;

const ToolbarHeader = styled(Toolbar)`
  background-color: ${constants.defaultPrimaryColor} !important;
  padding: 8px !important;
  & a {
    color: ${constants.primaryTextColor};
    &:hover {
      color: ${constants.primaryTextColor};
      opacity: 0.6;
    }
  }
`;

class Header extends React.Component {
  static propTypes = {
    location: PropTypes.shape({}),
    navbarPages: PropTypes.arrayOf(PropTypes.shape({})),
    disableSearch: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      navbarPages
    } = this.props;

    const burgerItems = [
      ...navbarPages,
    ];

    const buttonProps = {
      children: <ActionSettings />,
    };

    const LogoGroup = ({ small }) => (
      <VerticalAlignToolbar>
        {!small && <BurgerMenu menuItems={burgerItems} />}
        <AppLogo url={this.props.url} style={{ marginRight: 18 }} />
      </VerticalAlignToolbar>
    );

    LogoGroup.propTypes = {
      small: PropTypes.bool,
    };

    const LinkGroup = () => (
      <MediaQuery minDeviceWidth={768}>
        <VerticalAlignToolbar>
          {navbarPages.map(Page => (
            <TabContainer key={Page.key}>
              <div style={{ margin: '0 10px', textAlign: 'center', fontWeight: `${constants.fontWeightNormal} !important` }}>
                {Page}
              </div>
            </TabContainer>
          ))}
        </VerticalAlignToolbar>
      </MediaQuery>
    );

    const SettingsGroup = ({ user }) => (
      <VerticalAlignDropdown
        Button={IconButton}
        buttonProps={buttonProps}
      >
        <LocalizationMenu />
        <ReportBug />
      </VerticalAlignDropdown>
    );

    SettingsGroup.propTypes = {
      user: PropTypes.shape({}),
    };

    const ReportBug = () => (
      <BugLink
        href={REPORT_BUG_PATH}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Bug />
        <span>
          Bug!?
        </span>
      </BugLink>
    );

    // const LogOut = () => (
    //   <BugLink
    //     href={`${process.env.REACT_APP_API_HOST}/logout`}
    //     rel="noopener noreferrer"
    //   >
    //     <LogOutButton />
    //     <span>
    //       {strings.app_logout}
    //     </span>
    //   </BugLink>
    // );

    return (
      <div>
        <ToolbarHeader>
          <VerticalAlignDiv>
            <LogoGroup/>
            <LinkGroup />
          </VerticalAlignDiv>
          <VerticalAlignDiv style={{ marginLeft: 'auto' }}>
            <SettingsGroup/>
          </VerticalAlignDiv>
        </ToolbarHeader>
      </div>
    );
  }
}

export default Header;
