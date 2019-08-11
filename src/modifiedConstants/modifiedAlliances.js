import alliances from 'underlordsconstants/build/underlords_alliances.json';

const modified = {};
Object.keys(alliances).forEach(a => {
    const alliance = alliances[a];
    alliance.levels = alliance.levels.filter(level => !level.hidden);
    alliance.levels.sort((a, b) => a.unitcount - b.unitcount);
    modified[a] = alliance;
});

export default modified;