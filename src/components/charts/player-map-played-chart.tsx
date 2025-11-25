import Chart from "./chart";
import { tournamentMaps } from "@site/src/data/mapping";
import MapChartConfig from "@site/src/utils/map-chart-config";
import useDelayedColorMode from "@site/src/utils/use-delayed-color-mode";
import { merge } from 'lodash-es';
import { Filter } from "../filter/filter-dialog";
import { FilterLegendConfig } from "@site/src/utils/civ-chart-config";

export default function PlayerMapPlayedChart({ winCounts, lossCounts, filter }: { winCounts: Record<string, number>, lossCounts: Record<string, number>, filter: Filter }): JSX.Element {
    useDelayedColorMode();
    const playData = Object.fromEntries(tournamentMaps.map(map_name => [map_name, { win: winCounts[map_name] ?? 0, loss: lossCounts[map_name] ?? 0 }]));
    const win_data = [];
    const loss_data = [];
    const keys = [];
    for (const [key, value] of Object.entries(playData).sort(([k, a], [ka, b]) => {
        return b.win + b.loss - a.win - a.loss;
    })) {
        win_data.push(value.win);
        loss_data.push(value.loss);
        keys.push(key);
    }

    const style = getComputedStyle(document.body);
    const options = merge(MapChartConfig(style), FilterLegendConfig(style, filter, false), {
        plugins: {
            title: { display: true, text: 'Maps played' },
            plugins: { tooltip: { enables: true } },
        },
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true
            }
        }
    });
    return <Chart data={{
        datasets: [
            {
                label: 'Victories',
                data: win_data,
                backgroundColor: style.getPropertyValue('--ifm-color-primary')
            },
            {
                label: 'Defeats',
                data: loss_data,
                backgroundColor: style.getPropertyValue('--ifm-color-secondary'),
                borderColor: style.getPropertyValue('--ifm-color-secondary')
            },
        ],
        labels: keys
    }} options={options}></Chart>;
};
