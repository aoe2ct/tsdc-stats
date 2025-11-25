import playersData from '@site/src/data/players.json';
import { Fragment, useState } from 'react';
import styles from './base.module.css';
import { mapDraftNameToDisplay, mapGameNameToDisplay } from '@site/src/data/mapping';
import PlayerMapDraftChart from '@site/src/components/charts/player-map-draft-chart';
import PlayerCivDraftChart from '@site/src/components/charts/player-civ-draft-chart';
import PlayerMapPlayedChart from '@site/src/components/charts/player-map-played-chart';
import PlayerCivPlayedChart from '@site/src/components/charts/player-civ-played-chart';
import PlayerApmChart from '@site/src/components/charts/player-apm-chart';
import GameTimeChart from '@site/src/components/charts/game-time-chart';
import PlayerGamesTable from '@site/src/components/charts/player-games-table';

function countOccurrences(data: Array<string>): Record<string, number> {
    return data.reduce((counts, selection) => {
        if (!(selection in counts)) {
            return { ...counts, [selection]: 1 };
        }
        return { ...counts, [selection]: counts[selection] + 1 };
    }, {});
}

function listMostCounts(counts: Record<string, number>) {
    const maxCounts = Math.max(...Object.values(counts));
    return Object.entries(counts).filter(([_name, count]) => count == maxCounts).map(([name, _count]) => name).join(", ")
}

function getPlayerStats(playerData: typeof playersData) {
    const setData = playerData.reduce((accumulated, game) => {
        if (accumulated.seen.includes(game.set_id)) {
            return accumulated;
        }
        return { seen: [...accumulated.seen, game.set_id], games: [...accumulated.games, game] }
    }, { seen: [], games: [] }).games;
    const games = playerData.length;
    const wins = playerData.filter(data => data.winner).length;
    const mapPickCounts = countOccurrences(setData.map(data => data.map_picks.map(mapDraftNameToDisplay)).flat());
    const mapBanCounts = countOccurrences(setData.map(data => data.map_bans.map(mapDraftNameToDisplay)).flat());
    const civPickCounts = countOccurrences(setData.map(data => data.civ_picks).flat());
    const civBanCounts = countOccurrences(setData.map(data => data.civ_bans).flat());
    const civSnipeCounts = countOccurrences(setData.map(data => data.civ_snipes).flat());
    const mapPlayCounts = countOccurrences(playerData.map(data => mapGameNameToDisplay(data.map)));
    const mapWinCounts = countOccurrences(playerData.filter(data => data.winner).map(data => mapGameNameToDisplay(data.map)));
    const mapLossCounts = countOccurrences(playerData.filter(data => !data.winner).map(data => mapGameNameToDisplay(data.map)));
    const civPlayCounts = countOccurrences(playerData.map(data => data.civ));
    const opposingCivPlayCounts = countOccurrences(playerData.map(data => data.opponent_civ));
    const civWinCounts = countOccurrences(playerData.filter(data => data.winner).map(data => data.civ));
    const civLossCounts = countOccurrences(playerData.filter(data => !data.winner).map(data => data.civ));
    const opposingCivWinCounts = countOccurrences(playerData.filter(data => !data.winner).map(data => data.opponent_civ));
    const opposingCivLossCounts = countOccurrences(playerData.filter(data => data.winner).map(data => data.opponent_civ));
    const eAPM = playerData.map(game => game.eapm);
    const durations = playerData.map(game => game.duration);
    return {
        games,
        sets: new Set(playerData.map(data => data.set_id)).size,
        wins,
        win_perc: roundFloat(wins / games * 100) + '%',
        mapPickCounts,
        mapBanCounts,
        most_picked_map: listMostCounts(mapPickCounts),
        most_banned_map: listMostCounts(mapBanCounts),
        civPickCounts,
        civBanCounts,
        civSnipeCounts,
        most_picked_civ: listMostCounts(civPickCounts),
        most_banned_civ: listMostCounts(civBanCounts),
        mapPlayCounts,
        most_played_map: listMostCounts(mapPlayCounts),
        mapWinCounts,
        mapLossCounts,
        civPlayCounts,
        most_played_civ: listMostCounts(civPlayCounts),
        opposingCivPlayCounts,
        most_faced_civ: listMostCounts(opposingCivPlayCounts),
        civWinCounts,
        civLossCounts,
        opposingCivWinCounts,
        opposingCivLossCounts,
        minAPM: roundFloat(Math.min(...eAPM)),
        meanAPM: roundFloat(eAPM.reduce((sum, value) => sum + value, 0) / eAPM.length),
        maxAPM: roundFloat(Math.max(...eAPM)),
        eapm: eAPM,
        minDuration: formatDuration(Math.min(...durations)),
        maxDuration: formatDuration(Math.max(...durations)),
        meanDuration: formatDuration(durations.reduce((sum, value) => sum + value, 0) / durations.length),
    }
}

function roundFloat(x: number) {
    return Math.round(x * 100) / 100;
}

function formatDuration(duration: number) {
    const seconds = Math.round(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}`.padStart(2, "0") + ":" + `${minutes % 60}`.padStart(2, "0") + ":" + `${seconds % 60}`.padStart(2, "0");
}

export default function Base(): JSX.Element {
    const [filter, setFilter] = useState(null);
    (window as any).setFilter = setFilter;
    const [nameFilter, setNameFilter] = useState("");

    const filteredPlayersData = (filter != null ? playersData.filter(game => filter.brackets.includes(game.bracket)) : playersData).filter(game => game.player.toLowerCase().includes(nameFilter.toLowerCase()));
    const isFilterApplied = playersData.length !== filteredPlayersData.length;
    const allPlayerNames = Array.from(new Set(playersData.map(game => game.player))).sort()
    const playerNames = Array.from(new Set(filteredPlayersData.map(game => game.player))).sort()
    const [selectedPlayer, setSelectedPlayer] = useState(playerNames[0]);
    const selectedPlayerData = playersData.filter(data => data.player == selectedPlayer);
    const playerStats = getPlayerStats(selectedPlayerData);

    return (
        <Fragment>
            <sup className={styles.attributions}>Thanks to Beargwyn for compiling all the data.</sup>
            <sup className={styles.attributions}>Thanks to Salytmacska for creating the original website.</sup>
            <p>Here you can find the stats for individual players who took part in the tournament</p>
            <p>So far, <span className={styles['highlighted-text']}>{allPlayerNames.length}</span> players have played at least one set. {isFilterApplied ? <>Current filters include only <span className={styles['highlighted-text']}>{playerNames.length}</span></> : <>All players are selected. <strong>Use the bracket filter in the top right to narrow your options</strong></>}</p>
            <input type="text" placeholder='Find player...' onChange={(event) => setNameFilter(event.target.value)} /><br />
            <ul className={styles['players-list']}>
                {playerNames.map(player => <li key={player} className={styles['player-button'] + (selectedPlayer == player ? ' ' + styles['selected'] : '')}><button onClick={() => setSelectedPlayer(player)}>{player}</button></li>)}
            </ul>
            <h2>{selectedPlayer}'s stats</h2>
            <p>{selectedPlayer} played {playerStats.games} games over {playerStats.sets} sets with an average of {roundFloat(playerStats.games / playerStats.sets)} games per set. They won {playerStats.wins} of their games ({playerStats.win_perc})</p>
            <h3>Drafts data</h3>
            <p>{selectedPlayer}'s most picked map(s) is {playerStats.most_picked_map} and the most banned map(s) is {playerStats.most_banned_map}.</p>
            <p>This chart is showing the number of times each map was picked or banned during a draft. It is sorted by most picks.</p>
            <PlayerMapDraftChart pickCounts={playerStats.mapPickCounts} banCounts={playerStats.mapBanCounts} filter={filter}></PlayerMapDraftChart>
            <p>Next up is civilization picks in the drafts specifically.</p>
            <p>{selectedPlayer}'s most picked civ is/are {playerStats.most_picked_civ} and the most banned civ is/are {playerStats.most_banned_civ}.</p>
            <p>Here is how they drafted when it comes to civilizations. Snipes are the civilizations that {selectedPlayer} sniped from the enemy selection.</p>
            <PlayerCivDraftChart pickCounts={playerStats.civPickCounts} banCounts={playerStats.civBanCounts} snipeCounts={playerStats.civSnipeCounts} filter={filter}></PlayerCivDraftChart>
            <h3>Games data</h3>
            <p>Which maps were actually played? {selectedPlayer}'s most played map(s) is {playerStats.most_played_map}</p>
            <PlayerMapPlayedChart winCounts={playerStats.mapWinCounts} lossCounts={playerStats.mapLossCounts} filter={filter}></PlayerMapPlayedChart>
            <p>The next chart shows the number of times a civilization was played.</p>
            <p>{selectedPlayer} played most times with {playerStats.most_played_civ} and faced most times against {playerStats.most_faced_civ}.</p>
            <PlayerCivPlayedChart title='Civilizations played' civWinCounts={playerStats.civWinCounts} civLossCounts={playerStats.civLossCounts} filter={filter}></PlayerCivPlayedChart>
            <p>Let's look at the civs that were faced and whether {selectedPlayer} managed to win against them.</p>
            <PlayerCivPlayedChart title='Civilizations faced' civWinCounts={playerStats.opposingCivLossCounts} civLossCounts={playerStats.opposingCivWinCounts} filter={filter}></PlayerCivPlayedChart>
            <h3>Duration</h3>
            <p>How long each game was? Let's see on the next graph!</p>
            <p>The shortest game for {selectedPlayer} lasted {playerStats.minDuration}, while the longest game was {playerStats.maxDuration}. On average, the duration is {playerStats.meanDuration}.</p>
            <GameTimeChart gamesData={selectedPlayerData} filter={filter}></GameTimeChart>
            <h3>eAPM</h3>
            <p>Finally let's look at the effective Actions per Minute. {selectedPlayer} has a minimum of {playerStats.minAPM} eAPM, a maximum of {playerStats.maxAPM} and a mean of {playerStats.meanAPM}.</p>
            <p>Here is a representation of their eAPM over all the games played</p>
            {/* <p>Who is the fastest player in the tournament? We can see the eAPM over all brackets</p> */}
            <PlayerApmChart eapm={playerStats.eapm} bracket={selectedPlayerData.at(0).bracket}></PlayerApmChart>
            <h2>{selectedPlayer}'s Games</h2>
            <PlayerGamesTable games={selectedPlayerData}></PlayerGamesTable>
            {/* <hr></hr> */}
            Thanks for checking out T90 Sudden Death Cup in Stats!
        </Fragment>
    );
}
