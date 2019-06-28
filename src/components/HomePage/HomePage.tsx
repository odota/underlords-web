import React from 'react';
import { strings, underlordsLoc, heroes, alliances } from '../Localization/Localization';
import styles from './HomePage.module.css';
import { Link, RouteComponentProps } from 'react-router-dom';
import items from 'underlordsconstants/build/underlords_items.json';
import { GetHeroImage } from '../../utils';
// @ts-ignore
import path from 'path-browserify';

export default class HomePage extends React.Component<RouteComponentProps> {
    state = {
        items: [],
        alliances: [],
        heroes: []
    }

    public componentDidMount() {
        this.setState({
            items: Object.keys(items).sort(() => 0.5 - Math.random()).slice(0, 12),
            heroes: Object.keys(heroes).filter((e) => heroes[e].draftTier > 0)
                        .sort(() => 0.5 - Math.random()).slice(0, 12),
            alliances: Object.keys(alliances).filter((e) => alliances[e].heroes && alliances[e].heroes.length > 0)
                        .sort(() => 0.5 - Math.random()).slice(0, 12)
        });
    }

    public render() {
        return <div className={styles.Container}>
            <header>
                <h1 className={styles.LeadTitle}>{ strings.app_name }</h1>
                <h3 className={styles.SecondTitle}>{ strings.app_description }</h3>
                <p>{strings.home_description}</p>
                <a href="//opendota.com">{strings.home_description2}</a>
            </header>
            <main>
                <section className={styles.Links}>
                    <Link to={path.join(this.props.match.url, 'alliances')}>
                        <Collage urls={this.state.alliances.map((e) => {
                            return {
                                alt: e,
                                url: `${process.env.PUBLIC_URL}/images/alliances/${e}.jpg`
                            };
                        })}/>
                        <h4>{underlordsLoc["dac_ingame_tab_synergies"]}</h4>
                    </Link>
                    <Link to={path.join(this.props.match.url, 'heroes')}>
                        <Collage urls={this.state.heroes.map((e) => {
                            const hero = heroes[e as keyof typeof heroes];
                            return {
                                alt: hero.dota_unit_name,
                                url: GetHeroImage(hero.dota_unit_name)
                            };
                        })}/>
                        <h4>{underlordsLoc["dac_ingame_tab_heroes"]}</h4>
                    </Link>
                    <Link to={path.join(this.props.match.url, 'items')}>
                        <Collage urls={this.state.items.map((e) => {
                            const item = items[e as keyof typeof items];
                            return {
                                alt: item.icon,
                                url: `${process.env.PUBLIC_URL}/images/items/${item.icon}_psd.png`
                            };
                        })}/>
                        <h4>{underlordsLoc["dac_ingame_tab_items"]}</h4>
                    </Link>
                </section>
            </main>
        </div>
    }
}

const Collage = ( props: {urls: { alt: string, url: string}[]}) => {
    return <div className={styles.CollageContainer}>
        {
            props.urls.map((url) => {
                const style = {
                    left: Math.random() * 125,
                    top: Math.random() * 125
                };
                
                return <img alt={url.alt} src={url.url} style={style}/>
            })
        }
    </div>
}