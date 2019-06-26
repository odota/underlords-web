import alliances from './components/AlliancesPage/node_modules/underlordsconstants/build/underlords_alliances.json';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import abilities from 'underlordsconstants/build/underlords_abilities.json';
import items from 'underlordsconstants/build/underlords_items.json';

// TODO: Is there a better way to define this?
// howardc: Not sure why the typing fails if we use keyof typeof heroes, maybe too many different unions confuses TS?
type Hero = typeof heroes.abaddon;
type Heroes = { [key: string]: Hero };
type Ability = typeof abilities[keyof typeof abilities];
type Abilities = { [key: string]: Ability };
type GameStrings = { [key: string]: string };
type Alliance = typeof alliances[keyof typeof alliances];
type Alliances = { [key: string]: Alliance };
type Item = typeof items[keyof typeof items];
type Items = { [key: string]: Item };