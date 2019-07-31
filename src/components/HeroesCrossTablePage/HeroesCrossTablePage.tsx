import React, { useEffect, useState } from 'react';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import commonStyles from '../../common.module.css';
import styles from './HeroesCrossTablePage.module.css';
import { Hero } from '../../types';
import ReactTooltip from 'react-tooltip';
import { alliances, underlordsLoc, strings } from '../Localization/Localization';
import SortButtons from '../SortButtons/SortButtons';
import Helmet from 'react-helmet';
import { GetHeroImage } from '../../utils';

export default function HeroesCrossTablePage() {

  const [crossAlliances, setCrossAlliances]  = useState();
  const [emptyRows, setEmptyRows]  = useState();
  const [nonEmptyColumns, setNonEmptyColumns]  = useState();

  useEffect(() => {
    const allianceIndex = Object.keys(alliances);
    const cross: Array<string>[][] = [];
    for (let i = 0; i < allianceIndex.length; i++) {
      cross[i] = [];
      for (let j = 0; j < allianceIndex.length; j++) {
        cross[i][j] = [];
      }
    }

    function addPair(heroKey: string, firstAll: string, secAll: string) {
      const i = allianceIndex.findIndex((e) => e === firstAll);
      const j = allianceIndex.findIndex((e) => e === secAll);

      // Get number of heroes in this row
      const rowCounti = cross[i].reduce((prev, elem) => {
        return prev + elem.length;
      }, 0);

      const columnCounti = cross.reduce((prev, elem) => {
        return prev + elem[j].length
      }, 0);

      const rowCountj = cross[j].reduce((prev, elem) => {
        return prev + elem.length;
      }, 0);

      const columnCountj = cross.reduce((prev, elem) => {
        return prev + elem[i].length
      }, 0);

      if (rowCounti + columnCounti >= rowCountj + columnCountj) {
        cross[i][j].push(heroKey);
      } else {
        cross[j][i].push(heroKey);
      }
    }
    
    // sort by alliances with most heroes
    const sortedAlliances = Object.keys(alliances).sort((a, b) => {
      const first = alliances[a].heroes ? alliances[a].heroes.length : 0;
      const second = alliances[b].heroes ? alliances[b].heroes.length : 0;

      if (first === second) {
        return 0
      } else {
        return first > second ? 1 : -1;
      }
    }).reverse();

    const processedHeroes: string[] = [];

    sortedAlliances.forEach((a) => {
      const alliance = alliances[a];
      if (alliance.heroes) {
        alliance.heroes.forEach((hero: Hero) => {
          if (processedHeroes.find((e) => e === hero.key)) {
            return;
          }

          if (hero.draftTier > 0 && hero.keywords) {
            const alliances = hero.keywords.split(' ').sort();
            if (alliances.length < 2) {
              return;
            }
    
            const [firstAll, ...rest] = alliances;
    
            rest.forEach((e: string) => {
              addPair(hero.key, firstAll, e);
            })

            processedHeroes.push(hero.key);
          }
        })
      }
    })

    console.log(cross);
    // Check which rows and columns are empty
    const emptyRows: number[] = [];
    const nonEmptyColumns: number[] = [];

    cross.forEach((row, i) => {
      let empty = true;
      row.forEach((elem, j) => {
        if (elem.length > 0) {
          empty = false;
          nonEmptyColumns.push(j);
        }
      });
      if (empty) {
        emptyRows.push(i);
      }
    })

    setCrossAlliances(cross);
    setEmptyRows(emptyRows);
    setNonEmptyColumns(nonEmptyColumns);
    console.log(emptyRows);
    console.log(nonEmptyColumns);
  }, [])

  const allianceIndex = Object.keys(alliances);

  return <div className={commonStyles.PageContainer}>
    <tbody>
    {crossAlliances && crossAlliances.map((a1: [][], i: number) => {
      if (emptyRows && emptyRows.find((e: number) => e === i)) {
        return <></>
      }

      return <tr>
        <td>{allianceIndex[i]}</td>
        {
          a1.map((heroesArray, j) => {
            if (nonEmptyColumns && !nonEmptyColumns.find((e: number) => e === j)) {
              return <></>
            }

            return <td>
              { i === 0 && allianceIndex[j]} 
              { heroesArray && heroesArray.map((key: keyof typeof heroes) => {
                const hero = heroes[key];
                return <img 
                key={hero.key + i}               
                alt={hero.displayName}
                src={GetHeroImage(hero.dota_unit_name)}
                className={styles.Image}
                />
              })}
            </td>
          })
        }
      </tr>
    })}
    </tbody>
  </div>
}