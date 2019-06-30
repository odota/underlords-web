import React from "react";
import commonStyles from '../../common.module.css';
import styles from './TeamBuilderPage.module.css';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import alliances from 'underlordsconstants/build/underlords_alliances.json';
import { GetHeroImage } from "../../utils";
import { underlordsLoc } from '../Localization/Localization';
import { strings } from './../Localization/Localization';


function transformName(str) {
  const splitStr = str.toLowerCase().split('_');
  for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}

export default class TeamBuilderPage extends React.Component {
  static propTypes = {

  }

  state = {
    searchValue: "",
    team: [],
    synergies: {},
  }

  computeAlliances = () => {
    const team = [...new Set(this.state.team)]
    const synergies = {};
    Object.keys(alliances).map(a => alliances[a]).forEach(alliance => {
      alliance.heroes.forEach(allianceHero => {
        team.forEach(teamMember => {
            if(allianceHero.key === teamMember) {
              if(synergies[alliance.key]) {
                synergies[alliance.key].count = synergies[alliance.key].count + 1
              } else {
                synergies[alliance.key] = {count: 1, level: 0}
              }
              alliance.levels.forEach((level, index) => {
                if(synergies[alliance.key].count >= level.unitcount) {
                  synergies[alliance.key].level = index + 1;
                  synergies[alliance.key].levelUnitCount = level.unitcount;
                }
              })       
            }
        })
      })
    })
    this.setState({synergies});
  }

  handleSearchChange = (e) => {
    this.setState({searchValue: e.target.value})
  }

  handleHeroSelection = h => () => {
    if(this.state.team.length < 10) {
      this.setState({team: [...this.state.team, h.key]}, this.computeAlliances)
    }
    this.resetSearch();
  }

  handleHeroDeSelection = i => () => {
    const {team} = this.state;
    team.splice(i, 1);
    this.setState({team}, this.computeAlliances)
  }

  resetSearch = () => {
    this.setState({searchValue: ""});
  }

  render() {
    return(
      <div className={commonStyles.PageContainer}>
        <div className={styles.teamBuilderPageContainer}>
          <div className={styles.heroesSelectionArea}>
            <h2 style={{marginLeft: 4, marginBottom: 16}} className={styles.title}>Select</h2>
          <div className={styles.searchInputContainer}>
            <div className={styles.searchInput}>
              <span className={styles.searchIcon}>&#8981;</span>
              <input type="text" placeholder="Search for hero..." value={this.state.searchValue} onChange={this.handleSearchChange}>
              </input>
            </div>
          </div>
            {
              Object.keys(heroes)
              .map(h => heroes[h])
              .filter( h => new RegExp(this.state.searchValue, 'i').test(transformName(h.key)) && 
                h.dota_unit_name.substring(0, "npc_dota_hero_".length) === "npc_dota_hero_")
              .map(h =>
                <img 
                key={h.key} 
                className={styles.heroImageSelectionArea} 
                alt={h.displayName} 
                src={GetHeroImage(h.dota_unit_name)}
                onClick={this.handleHeroSelection(h)}
                />
              )             
            }
          </div>
          <div className={styles.teamArea}>
            <h2 className={styles.title}>Team</h2>
              <div className={styles.selectedHeroesArea}>
                {
                  this.state.team.map((h, i) => {
                    const hero = heroes[h];
                    return(
                      <div className={styles.heroImageTeamAreaContainer}>
                          <img 
                          key={hero.key + i}               
                          alt={hero.displayName}
                          className={styles.heroImageTeamArea} 
                          src={GetHeroImage(hero.dota_unit_name)}
                          onClick={this.handleHeroDeSelection(i)}
                          />
                          <div className={styles.heroName}>{transformName(h)}</div>
                      </div>
                    )
                  })
                }
              </div>
              <div>
                <h2 className={styles.title}>{underlordsLoc['dac_ingame_tab_synergies']}</h2>
                <table>
                  <thead>
                    <th>{strings.th_synergy}</th>
                    <th>{strings.th_count}</th>
                    <th>{strings.th_bonus}</th>
                  </thead>
                  <tbody>
                    {
                      Object.keys(this.state.synergies).map(key => { 
                        const {level, count, levelUnitCount} = this.state.synergies[key]
                        return (
                          <tr>
                            <td>
                              <div className={styles.synergyText}>
                                <img className={styles.allianceImg} alt={key} src={`${process.env.PUBLIC_URL}/images/alliances/${key}.jpg`} />
                                {underlordsLoc[`dac_synergy_${key}`]}
                              </div>
                            </td>
                            <td>{count}</td>
                            <td>{level ? <div>{`(${levelUnitCount}) ${underlordsLoc[`dac_synergy_desc_${key}_${level}`]}`}</div> : null}</td>
                          </tr>)
                      })
                    }
                  </tbody>
                </table>
              </div>    
          </div>
        </div>
      </div>
    )
  }
}