import React from "react";
import ReactTooltip from 'react-tooltip';
import commonStyles from '../../common.module.css';
import styles from './TeamBuilderPage.module.css';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import alliances from 'underlordsconstants/build/underlords_alliances.json';
import { GetHeroImage } from "../../utils";
import { underlordsLoc } from '../Localization/Localization';
import { strings } from './../Localization/Localization';
import querystring from 'querystring';

// TODO: to unify this logic with /components/AllianceCard/AllianceCard.tsx
const Synergy = ({synergy, count, level, levelUnitCount, handleAllianceFilter}) => {
  const alliance = alliances[synergy];
  const tiers = alliance.levels.map((level,i) => level.unitcount - (i > 0 ? alliance.levels[i-1].unitcount : 0));
  let c = count;
  return(
    <div 
    className={styles.activeAllianceContainerOuter}
    style={{background: level > 0 ? `radial-gradient(ellipse at 50% 80%, rgba(134, 233, 255, 0.17), rgba(255, 255, 255, 0.1))` : 'rgba(255, 255, 255, 0.03'}}
    >
      <div className={styles.activeAllianceContainer} style={{backgroundColor: `rgba(${alliance.color.split(' ').join(',')},.22)`}}>
        <div className={styles.allianceImgContainer} data-tip={synergy} data-for="alliance" data-offset="{'top': 0, 'left': 250}">
          <img 
          className={styles.allianceImg} 
          alt={synergy} 
          src={`${process.env.PUBLIC_URL}/images/alliances/${synergy}.jpg`} 
          onClick={handleAllianceFilter(synergy)}
          />
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
    {level ? 
      <div className={styles.synergyDescription}>
        {`(${levelUnitCount}) ${underlordsLoc[`dac_synergy_desc_${synergy}_${level}`]}`}
      </div> 
    : 
      <div className={`${styles.synergyDescription} ${styles.nonActive}`}>
        {`${underlordsLoc[`dac_synergy_desc_${synergy}_1`]}`}
      </div> 
    }
  </div>
  )
}

const AllianceFilter = ({handleAllianceFilter, filteredAlliances}) => 
  <div className={styles.allianceFilterContainer}>
    {
      Object.keys(alliances).filter(alliance => alliances[alliance].heroes.length > 0).map(alliance => 
        <img
        className={`${styles.allianceFilterImg} ${filteredAlliances.indexOf(alliance) !== -1 ? styles.allianceFilterImgActive : null}`}
        alt={alliance} 
        src={`${process.env.PUBLIC_URL}/images/alliances/${alliance}.jpg`} 
        onClick={handleAllianceFilter(alliance)}
        title={underlordsLoc[`dac_synergy_${alliance}`]}
        />
      )
    }   
  </div>

export default class TeamBuilderPage extends React.Component {

  teamParsedFromQuery = querystring.parse(window.location.search.substring(1)).team;

  state = {
    searchValue: "",
    team: [].concat((this.teamParsedFromQuery && this.teamParsedFromQuery.split(","))  || []),
    synergies: {},
    filteredAlliances: [],
  }

  componentDidMount() {
    this.computeAlliances();
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
    this.setState({synergies}, () => {
      ReactTooltip.rebuild();
    });
    this.updateQueryString();
  }

  updateQueryString = () => {
    const { team } = this.state;
    window.history.replaceState(
      '',
      '',
      `?team=${team.join()}`,
    );
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

  handleAllianceFilter = alliance => () => {
    const { filteredAlliances } = this.state;
    const index = filteredAlliances.indexOf(alliance);

    if(index === -1) {
      filteredAlliances.push(alliance);
    } else {
      filteredAlliances.splice(index, 1);
    }
    this.setState(filteredAlliances);
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
          <AllianceFilter handleAllianceFilter={this.handleAllianceFilter} filteredAlliances={this.state.filteredAlliances}/>
            {
              Object.keys(heroes)
              .map(h => heroes[h])
              .filter( h => new RegExp(this.state.searchValue, 'i').test(underlordsLoc[`${h.displayName}`]) && 
                h.dota_unit_name.startsWith("npc_dota_hero_"))
              .filter(h => {
                const { filteredAlliances } = this.state;
                if(filteredAlliances.length === 0) {
                  return true;
                }
                const heroAlliances = h.keywords.split(" ");
                for(let i = 0; i < heroAlliances.length; i++) {
                  if(filteredAlliances.indexOf(heroAlliances[i]) !== -1) {
                    return true;
                  }
                }
                return false;
              })
              .map(h =>
                <img 
                key={h.key} 
                className={styles.heroImageSelectionArea} 
                alt={h.displayName} 
                src={GetHeroImage(h.dota_unit_name)}
                onClick={this.handleHeroSelection(h)}
                title={underlordsLoc[`${h.displayName}`]}
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
                          <div className={styles.heroAllianceIconContainer}>
                            {
                              hero.keywords.split(" ").map(s => 
                                <img className={styles.heroAllianceIcon} 
                                alt={s} 
                                src={`${process.env.PUBLIC_URL}/images/alliances/${s}.jpg`} 
                                />
                              )
                            }
                          </div>
                          <img 
                          key={hero.key + i}               
                          alt={hero.displayName}
                          className={styles.heroImageTeamArea} 
                          src={GetHeroImage(hero.dota_unit_name)}
                          onClick={this.handleHeroDeSelection(i)}
                          />
                          <div className={styles.heroName}>{underlordsLoc[`${hero.displayName}`]}</div>
                      </div>
                    )
                  })
                }
              </div>
              <div>
                <h2 className={styles.title}>{underlordsLoc['dac_ingame_tab_synergies']}</h2>
                <div className={styles.synergiesContainer}>
                  {
                    Object.keys(this.state.synergies)
                    .sort((a, b) => this.state.synergies[b].level-this.state.synergies[a].level)
                    .map(key => 
                      <Synergy 
                      synergy={key} 
                      count={this.state.synergies[key].count} 
                      level={this.state.synergies[key].level}
                      levelUnitCount={this.state.synergies[key].levelUnitCount}
                      handleAllianceFilter={this.handleAllianceFilter}
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