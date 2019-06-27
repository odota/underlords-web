import React from 'react';
import styles from './AllianceCard.module.css';
import commonStyles from '../../common.module.css';
import { underlordsLoc, abilitiesLoc } from '../Localization/Localization';
import ReactTooltip from 'react-tooltip';
import { Hero, Alliance, GameStrings } from '../../types';
import HeroCard from '../HeroCard/HeroCard';
import { GetHeroImage } from '../../utils';

export default class AllianceCard extends React.Component<{ alliance: Alliance }> {
  render() {
    const { alliance } = this.props;
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
          <h1 className={commonStyles.Title}>{underlordsLoc[`dac_synergy_${alliance.key}`]}</h1>
        </div>
        <div className={commonStyles.CardBody}>
          <div>
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
                  <img data-tip data-for={`hero_${e.dota_unit_name}`} alt={e.displayName} src={GetHeroImage(e.dota_unit_name)} />
                </div>
            })}
          </div>
        </div>
      </div>
  }
}

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