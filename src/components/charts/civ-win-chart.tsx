import CivChartConfig, { FilterLegendConfig } from "@site/src/utils/civ-chart-config";
import Chart from "./chart";
import useDelayedColorMode from "@site/src/utils/use-delayed-color-mode";
import { merge } from 'lodash-es';
import { Filter } from "../filter/filter-dialog";
import { allCivs } from "@site/src/data/mapping";

export default function CivWinChart({ draftsData, gamesData, filter }: { draftsData: { civDrafts: any[] }, gamesData: any[], filter: Filter }): JSX.Element {
    useDelayedColorMode();
    const baseDraftData: { [key: string]: { wins: number, losses: number, winRate: number } } = Object.fromEntries(allCivs.map((civ) => [civ, { wins: 0, losses: 0, winRate: 0 }]));
    const civWinData: { [key: string]: { wins: number, losses: number, winRate: number } } = {
        ...baseDraftData,
        ...gamesData.reduce(
            (acc, game) => {
                const winningCiv = game.winningCiv;
                const losingCiv = game.losingCiv;
                if (acc.hasOwnProperty(winningCiv)) {
                    acc[winningCiv].wins += 1;
                } else {
                    acc[winningCiv] = { wins: 1, losses: 0 };
                }
                if (acc.hasOwnProperty(losingCiv)) {
                    acc[losingCiv].losses += 1;
                } else {
                    acc[losingCiv] = { wins: 0, losses: 1 };
                }
                return acc;
            },
            {},
        )
    };
    const civPlayData = draftsData.civDrafts.reduce<{ [key: string]: number }>((acc, draft) => {
        const picks = draft.draft.filter(v => ['pick', 'snipe'].includes(v.action));
        for (const pick of picks) {
            if (!acc.hasOwnProperty(pick.map)) {
                acc[pick.map] = 0;
            }
            if (pick.action == 'snipe') {
                acc[pick.map] -= 1;
            } else {
                acc[pick.map] += 1;
            }
        }
        return acc;
    }, {})
    const data = [];
    const playRate = [];
    const gamesPlayed = [];
    const drafted = [];
    const keys = [];
    Object.entries(civWinData).forEach(([key, value]) => {
        value.winRate = value.wins / (value.wins + value.losses)
        if ((value.wins + value.losses) == 0) {
            value.winRate = 0;
        }
    });
    for (const [key, value] of Object.entries(civWinData).sort(([ka, a], [kb, b]) => {
        if (b.winRate == a.winRate) {
            if ((b.wins + b.losses) == (a.wins + a.losses)) {
                return civPlayData[ka] - civPlayData[kb]
            }
            return b.wins + b.losses - a.wins - a.losses
        }
        return b.winRate - a.winRate
    })) {
        data.push(value.winRate);
        if (key in civPlayData) {
            playRate.push(Math.min((value.losses + value.wins) / civPlayData[key], 1))
        } else {
            playRate.push(0);
        }
        drafted.push(civPlayData[key] ?? 0);
        gamesPlayed.push(value.losses + value.wins);
        keys.push(key);
    }

    const style = getComputedStyle(document.body);
    const options = merge(CivChartConfig(style, data), FilterLegendConfig(style, filter, true), {
        plugins: {
            title: {
                display: true,
                text: 'Civilization win and play rate',
            },
            tooltip: {
                enables: true,
                callbacks: {
                    label: ({ dataIndex }) => {
                        return `${(data[dataIndex] * 100).toPrecision(4)}% Win Rate (${gamesPlayed[dataIndex]}/${drafted[dataIndex]} played/picked)`;
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value, index, values) {
                        return value * 100 + '%';
                    },
                },
            },
        },
    });
    return <Chart data={{
        datasets: [{
            data: data,
            backgroundColor: data.map((_v, i) => i % 2 === 0 ? style.getPropertyValue('--ifm-color-primary') : style.getPropertyValue('--ifm-color-secondary')),
        }, {
            data: data,
            backgroundColor: data.map((_v, i) => i % 2 === 0 ? style.getPropertyValue('--ifm-color-primary-lightest') : style.getPropertyValue('--ifm-color-secondary-lightest')),
            borderWidth: 1,
            type: 'line'
        }], labels: keys
    }} options={options}></Chart>;
};
