import React from 'react';
import { IconGithub } from '../Icons';
import { strings } from '../Localization/Localization';

export default () => {
  const links = [{
    tooltip: strings.app_github,
    path: `//github.com/odota/underlords-ui`,
    icon: <IconGithub />,
  }];

  // if (DISCORD_LINK) {
  //   links.push({
  //     tooltip: strings.app_discord,
  //     path: `//discord.gg/${DISCORD_LINK}`,
  //     icon: <IconDiscord />,
  //   });
  // }

  return links.map(link => (
    <a
      key={link.path}
      target="_blank"
      rel="noopener noreferrer"
      data-hint-position="top"
      data-hint={link.tooltip}
      href={link.path}
    >
      {link.icon}
    </a>
  ));
};
