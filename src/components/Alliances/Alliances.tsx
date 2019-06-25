import React from 'react';
import alliances from 'dotaconstants/build/underlords_alliances.json';
import heroes from 'dotaconstants/build/underlords_heroes.json';
import styles from './Alliances.module.css';
import commonStyles from '../common.module.css';
import gameStrings from 'dotaconstants/build/underlords_localization_en.json';

// // TODO: Is there a better way to define this?
type Hero = typeof heroes.abaddon;
type Alliance = typeof alliances[keyof typeof alliances] & { 
  name: string
  heroes: Hero[]
};
type GameStrings = { [key: string]: string };

export default class Alliances extends React.Component {

  state = {
    alliances: [],
    heroes: []
  };

  // TODO: Is there a better way to avoid this error?
  // ts(7053): "Element implicitly has an 'any' type because expression of type 'string' can't be used to index type"
  gameStrings: { [key: string]: string } = gameStrings;

  componentDidMount() {
    this.setState({
      alliances: Object.keys(alliances).map((key) => {
        let a: Partial<Alliance> = alliances[key as keyof typeof alliances];
        a.name = key.toLowerCase();
        
        let allianceHeroes: Hero[] = [];
        Object.entries(heroes).forEach(([k, v]) => {
          if (v.draftTier > 0 && v.keywords &&  v.keywords.includes(a.name as string)) {
            if (v.displayName) {
              v.displayName = this.gameStrings[v.displayName.replace("#", "")];
            }
            allianceHeroes.push(v as Hero);
          }
        })
        a.heroes = allianceHeroes;
        return a;
      }) as Alliance[],
    })

  }

  render() {
    return <div className={commonStyles.CardsContainer}>
          {this.state.alliances.map((alliance: Alliance, i: number) => {
            const maxUnits = alliance.levels[alliance.levels.length - 1].unitcount;
            let needsThreeUnits = false;
            if (alliance.levels.length > 1) {
              needsThreeUnits = alliance.levels[1].unitcount - alliance.levels[0].unitcount === 3
            } else if (alliance.levels[0] && alliance.levels[0].unitcount === 3) {
              needsThreeUnits = true;
            }
            if (alliance.heroes.length < 1) {
              return <div/> //Satyr doesn't exist yet?
            }
            return <div className={commonStyles.Card} key={i}>
                <div className={commonStyles.CardCapSmallImage}>
                  <img src={`${process.env.PUBLIC_URL}/images/alliances/${alliance.name}.jpg`} />
                  <div className={commonStyles.Title}>{this.gameStrings[`dac_synergy_${alliance.name}`]}</div>
                </div>
                <div className={commonStyles.CardBody}>
                  {(alliance.levels as any[]).map((e: any, i: number) => {
                    return <div>
                        <UnitIndicator num={e.unitcount} max={maxUnits} color={alliance.color} needsThreeUnits={needsThreeUnits}/>
                        <p className={styles.Effect}>{this.gameStrings[`dac_synergy_desc_${alliance.name}_${i + 1}`]}</p>
                      </div>
                  })}
                </div>
                <div>
                  {alliance.heroes.map((e) => {
                    return <img className={styles.HeroImage} src={GetHeroImage(e.dota_unit_name)} />

                  })}
                </div>
              </div>
          })}
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
      return <div className={styles.Unit} style={style}/>
    })}
  </div>

}