import Chart from "./chart";
import { tournamentMaps } from "@site/src/data/mapping";
import MapChartConfig from "@site/src/utils/map-chart-config";
import useDelayedColorMode from "@site/src/utils/use-delayed-color-mode";
import { merge } from 'lodash-es';
import { Filter } from "../filter/filter-dialog";
import { FilterLegendConfig } from "@site/src/utils/civ-chart-config";

export default function PlayerMapDraftChart({ pickCounts, banCounts, filter }: { pickCounts: Record<string, number>, banCounts: Record<string, number>, filter: Filter }): JSX.Element {
    useDelayedColorMode();
    const draftData = Object.fromEntries(tournamentMaps.map(map_name => [map_name, { pick: pickCounts[map_name] ?? 0, ban: banCounts[map_name] ?? 0 }]));
    const pick_data = [];
    const ban_data = [];
    const keys = [];
    for (const [key, value] of Object.entries(draftData).sort(([k, a], [ka, b]) => {
        if (a.pick + b.pick > 0) {
            return b.pick - a.pick;
        }
        return b.ban - a.ban;
    })) {
        pick_data.push(value.pick);
        ban_data.push(value.ban);
        keys.push(key);
    }

    const style = getComputedStyle(document.body);
    const options = merge(MapChartConfig(style), FilterLegendConfig(style, filter, false), {
        plugins: {
            title: { display: true, text: 'Maps drafting' },
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
                label: 'Picks',
                data: pick_data,
                backgroundColor: style.getPropertyValue('--ifm-color-primary')
            },
            {
                label: 'Bans',
                data: ban_data,
                backgroundColor: style.getPropertyValue('--ifm-color-secondary'),
                borderColor: style.getPropertyValue('--ifm-color-secondary')
            },
        ],
        labels: keys
    }} options={options}></Chart>;
};
