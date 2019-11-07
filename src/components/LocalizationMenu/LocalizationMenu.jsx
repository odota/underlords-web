import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import styled from 'styled-components';
import { formatLanguages } from '../../utils';

const LanguageContainerDiv = styled.div`
  max-height: 300px;
  overflow: auto;
`;

export default class LocalizationMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };

    this.formatLanguages = formatLanguages();
  }

  handleOnClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    return (
      <div style={{ minWidth: '200px' }}>
        <LanguageContainerDiv>
          {Object.entries(this.formatLanguages).map(([name, lang]) => (
              <a key={name} href={`/${lang}/`}>
                <MenuItem
                    key={name}
                    primaryText={name}
                    onClick={(e) => { localStorage.setItem('lang', lang)}}
                />
            </a>))}
        </LanguageContainerDiv>
      </div>
    );
  }
}
