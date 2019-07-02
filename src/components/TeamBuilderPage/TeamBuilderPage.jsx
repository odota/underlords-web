import React from "react";
import commonStyles from '../../common.module.css';
import styles from './TeamBuilderPage.module.css';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import alliances from 'underlordsconstants/build/underlords_alliances.json';
import { GetHeroImage } from "../../utils";
import { underlordsLoc } from '../Localization/Localization';
import { strings } from './../Localization/Localization';

const Synergy = ({synergy, count, level, levelUnitCount}) => {
  const alliance = alliances[synergy];
  const tiers = alliance.levels.map((level,i) => level.unitcount - (i > 0 ? alliance.levels[i-1].unitcount : 0));
  let c = count;
  return(
    <div className={styles.activeAllianceContainerOuter}>
      <div className={styles.activeAllianceContainer} style={{backgroundColor: `rgba(${alliance.color.split(' ').join(',')},.22)`}}>
        <div className={styles.allianceImgContainer}>
          <img className={styles.allianceImg} alt={synergy} src={`${process.env.PUBLIC_URL}/images/alliances/${synergy}.jpg`} />
        </div>
        <div className={styles.allianceTiersContainer}>
          {
            tiers.map(tier => {
              return(
                <div className={styles.allianceTier}>
                  {
                    [...Array(tier)].map(_ => {
                      c = c - 1;
                      return(
                        <div className={`${styles.tierCount} ${c >= 0 ? styles.activeCount : null}`}></div>
                      )
                    })
                  }
                </div>    
              )
            })
          }            
        </div>
      </div>
    {level ? <div className={styles.synergyDescription}>{`(${levelUnitCount}) ${underlordsLoc[`dac_synergy_desc_${synergy}_${level}`]}`}</div> : null}
  </div>
  )
}

function transformName(str) {
  const splitStr = str.toLowerCase().split('_');
  for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}

export default class TeamBuilderPage extends React.Component {

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
    if(this.state.team.length < 11) {
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
            <h2 style={{marginLeft: 4, marginBottom: 16}} className={styles.title}>{strings.select}</h2>
          <div className={styles.searchInputContainer}>
            <div className={styles.searchInput}>
              <span className={styles.searchIcon}>&#8981;</span>
              <input type="text" placeholder={strings.search_hero} value={this.state.searchValue} onChange={this.handleSearchChange}>
              </input>
            </div>
          </div>
            {
              Object.keys(heroes)
              .map(h => heroes[h])
              .filter( h => new RegExp(this.state.searchValue, 'i').test(transformName(h.key)) && 
                h.dota_unit_name.startsWith("npc_dota_hero_"))
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
            <h2 className={styles.title}>{strings.team}</h2>
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
                <div className={styles.synergiesContainer}>
                  {
                    Object.keys(this.state.synergies).map(key => 
                      <Synergy 
                      synergy={key} 
                      count={this.state.synergies[key].count} 
                      level={this.state.synergies[key].level}
                      levelUnitCount={this.state.synergies[key].levelUnitCount}
                      />
                    )
                  }
                </div>
              </div>    
          </div>
        </div>
      </div>
    )
  }
}