import React, { useEffect, useState } from 'react';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import commonStyles from '../../common.module.css';
import { Hero } from '../../types';
import HeroCard from '../HeroCard/HeroCard';
import ReactTooltip from 'react-tooltip';
import { alliances, underlordsLoc, strings } from '../Localization/Localization';
import SortButtons from '../SortButtons/SortButtons';
import Helmet from 'react-helmet';

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

    // const cross: { [index: string]: { [index: string]: string[]}}= {};

    function addPair(heroKey: string, firstAll: string, secAll: string) {
      const i = allianceIndex.findIndex((e) => e === firstAll);
      const j = allianceIndex.findIndex((e) => e === secAll);

      cross[i][j].push(heroKey);
      // if (firstAll in cross) {
      //   if (secAll in cross[firstAll]) {
      //     cross[firstAll][secAll].push(heroKey);
      //   } else {
      //     cross[firstAll][secAll] = [heroKey];
      //   }
      // } else {
      //   cross[firstAll] = {
      //     [secAll]: [heroKey]
      //   }
      // }
    }

    Object.entries(heroes).forEach(([heroKey, hero]) => {
      if (hero.draftTier > 0 && hero.keywords) {
        const alliances = hero.keywords.split(' ').sort();
        if (alliances.length < 2) {
          return;
        }

        const [firstAll, ...rest] = alliances;

        rest.forEach((e) => {
          addPair(heroKey, firstAll, e);
        })
      }
    });

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

  return <div>
    <tbody>
    {crossAlliances && crossAlliances.map((a1: [][], i: number) => {
      if (emptyRows && emptyRows.find((e: number) => e === i)) {
        return <></>
      }

      return <tr>
        <td>{allianceIndex[i]}</td>
        {
          a1.map((heroes, j) => {
            if (nonEmptyColumns && !nonEmptyColumns.find((e: number) => e === j)) {
              return <></>
            }

            return <td>
              { i === 0 && allianceIndex[j]} 
              { heroes && heroes.toString()}
            </td>
          })
        }
      </tr>
    })}
    </tbody>
  </div>
}