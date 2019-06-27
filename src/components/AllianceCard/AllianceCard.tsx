import React from 'react';
import styles from './AllianceCard.module.css';
import commonStyles from '../../common.module.css';
import { underlordsLoc, abilitiesLoc } from '../Localization/Localization';
import ReactTooltip from 'react-tooltip';
import { Hero, Alliance, GameStrings } from '../../types';
import HeroCard from '../HeroCard/HeroCard';

export default class AllianceCard extends React.Component<{ alliance: Alliance, embedded: boolean }> {
  render() {
    const { alliance, embedded } = this.props;
    if (!alliance || !alliance.levels || !alliance.heroes || alliance.heroes.length < 1) {
      return null;
    }
    const maxUnits = alliance.levels && alliance.levels.length ? alliance.levels[alliance.levels.length - 1].unitcount : 0;
    let needsThreeUnits = false;
    if (alliance.levels && alliance.levels.length > 1) {
      needsThreeUnits = alliance.levels[1].unitcount - alliance.levels[0].unitcount === 3
    } else if (alliance.levels && alliance.levels[0] && alliance.levels[0].unitcount === 3) {
      needsThreeUnits = true;
    }

    return <div className={commonStyles.Card}>
        <div className={commonStyles.CardCapSmallImage}>
          <img alt={alliance.name} src={`${process.env.PUBLIC_URL}/images/alliances/${alliance.key}.jpg`} />
          <div className={commonStyles.Title}>{underlordsLoc[`dac_synergy_${alliance.key}`]}</div>
        </div>
        <div className={commonStyles.CardBody}>
          {alliance.levels.map((e: any, i: number) => {
            return <div key={i}>
                <UnitIndicator num={e.unitcount} max={maxUnits} color={alliance.color} needsThreeUnits={needsThreeUnits}/>
                <p className={styles.Effect}>{underlordsLoc[`dac_synergy_desc_${alliance.key}_${i + 1}`]}</p>
              </div>
          })}
        </div>
        <div>
          {alliance.heroes.map((e: Hero, i: number) => {
            return <div className={commonStyles.ImageInRow} key={i}>
                <img data-tip data-for={`hero${e.dota_unit_name}`} alt={e.displayName} src={GetHeroImage(e.dota_unit_name)} />
                {
                  embedded ?
                  <div/>
                  : <ReactTooltip id={`hero${e.dota_unit_name}`} effect="solid" place="bottom">
                    <HeroCard hero={e} embedded={true}/>
                  </ReactTooltip>
                }
              </div>
          })}
        </div>
      </div>
  }
}

const GetHeroImage = ( dotaName: string ) => `https://api.opendota.com/apps/dota2/images/heroes/${dotaName.replace('npc_dota_hero_', '')}_sb.png?`;

const UnitIndicator = (props: { num: number, max: number, color: string, needsThreeUnits: boolean}) => {
  const { num, max, color, needsThreeUnits } = props;
  return <div className={styles.UnitCountContainer}>
    {Array.from(Array(max).keys()).map((e: any, i: number) => {
      let style = {
        backgroundColor: 'initial',
        height: needsThreeUnits ? '28%': '45%'
      }
      if (i < num) {
        style.backgroundColor = `rgb(${color})`;
      }
      return <div className={styles.Unit} style={style} key={i}/>
    })}
  </div>
}