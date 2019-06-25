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

            return <div className={commonStyles.Card} key={i}>
                <div className={commonStyles.CardCapSmallImage}>
                  <img src={`${process.env.PUBLIC_URL}/images/alliances/${alliance.name}.jpg`} />
                  <div className={commonStyles.Title}>{this.gameStrings[`dac_synergy_${alliance.name}`]}</div>
                </div>
                <div>{(alliance.levels as any[]).map((e: any, i: number) => {
                  return <div>
                      <UnitIndicator num={e.unitcount} max={maxUnits} color={alliance.color}/>
                      <p className={styles.Effect}>{this.gameStrings[`dac_synergy_desc_${alliance.name}_${i + 1}`]}</p>
                    </div>
                })}</div>
                <div>{JSON.stringify(alliance)}</div>
              </div>
          })}
        </div>
  }
}

const UnitIndicator = (props: { num: number, max: number, color: string}) => {
  const { num, max, color } = props;
  return <div className={styles.UnitCountContainer}>
    {Array.from(Array(max).keys()).map((e: any, i: number) => {
      let style = {
        backgroundColor: 'initial'
      }
      if (i < num) {
        style.backgroundColor = `rgb(${color})`;
      }
      return <div className={styles.Unit} style={style}/>
    })}
  </div>

}