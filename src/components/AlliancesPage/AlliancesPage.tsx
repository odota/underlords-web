import React from 'react';
import commonStyles from '../../common.module.css';
import AllianceCard from '../AllianceCard/AllianceCard';
import { alliances, underlordsLoc } from '../Localization/Localization';
import { Alliance } from '../../types';
import ReactTooltip from 'react-tooltip';
import SortButtons from '../SortButtons/SortButtons';

export default class AlliancesPage extends React.Component {

  state = {
    order: Object.keys(alliances),
    currentSort: 'displayName',
    isAscending: false //so that it's ascending on componentMount
  };

  sorts = [
      {
          by: 'name',
          name: "dac_heropedia_name",
      }, {
          by: 'numHeroes',
          name: "dac_ingame_tab_heroes"
      }, {
        by: 'tier',
        name: "dac_heropedia_tiers"
    },
  ];

  constructor(props: any) {
    super(props);
    this.sort = this.sort.bind(this);
  }

  componentDidMount() {
    this.sort("name");
  }

  private sort(by: keyof Alliance) {
    const ascending: boolean = this.state.currentSort === by ? !this.state.isAscending : true;
    const order: number = ascending ? 1 : -1;
    let newSort: string[] = this.state.order
        .sort((x: string, y: string) => {
            let a: Alliance = alliances[x as keyof typeof alliances];
            let b: Alliance = alliances[y as keyof typeof alliances];

            let first =  a[by] || 0;
            let second = b[by] || 0;
            if (by === 'name') {
              first = underlordsLoc[`dac_synergy_${a.key}`];
              second = underlordsLoc[`dac_synergy_${b.key}`];
            } else if (by === "numHeroes") {
              first = a.heroes ? a.heroes.length : 0;
              second = b.heroes ? b.heroes.length : 0;
            } else if (by === "tier") {
              first = a.levels ? a.levels.length : 0;
              second = b.levels ? b.levels.length : 0;
            }

            if (first === second) {
                return underlordsLoc[`dac_synergy_${a.key}`] > underlordsLoc[`dac_synergy_${b.key}`] ? 1 : -1;
            }
            return order * (first > second ? 1 : -1);
        });

    this.setState({
        heroes: newSort,
        currentSort: by,
        isAscending: ascending
    }, () => {
      ReactTooltip.rebuild();
    });
  }

  public render() {
    return <div className={commonStyles.PageContainer}>
          <div className={commonStyles.PageSectionHeader}>
            <h1>{underlordsLoc["dac_ingame_tab_synergies"]}</h1>
            <SortButtons sorts={this.sorts} 
                sortFunction={this.sort}
                currentSort={this.state.currentSort}
                isAscending={this.state.isAscending}/>
        </div>
        <div className={commonStyles.CardsContainer}>
          {this.state.order.map((key: string, i: number) =>{
          return <AllianceCard alliance={alliances[key]} key={i} />})}
      </div>
    </div>
  }
}