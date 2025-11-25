import Chart from "./chart";
import { mapDraftNameToDisplay, tournamentMaps } from "@site/src/data/mapping";
import MapChartConfig from "@site/src/utils/map-chart-config";
import useDelayedColorMode from "@site/src/utils/use-delayed-color-mode";
import { merge } from 'lodash-es';
import { Filter } from "../filter/filter-dialog";
import { FilterLegendConfig } from "@site/src/utils/civ-chart-config";

export default function MapBanChart({ draftsData, filter }: { draftsData: { mapDrafts: any[] }, filter: Filter }): JSX.Element {
    useDelayedColorMode();
    const draftPickData: { [key: string]: number } = draftsData.mapDrafts.reduce(
        (acc, draft) => {
            const mapPicks = draft.draft.filter(v => v.action === 'ban');
            for (const pick of mapPicks) {
                const mapName = mapDraftNameToDisplay(pick.map);
                if (!acc.hasOwnProperty(mapName)) {
                    acc[mapName] = 0;
                }
                acc[mapName] += 1;
            }
            return acc;
        },
        Object.fromEntries(tournamentMaps.map(map_name => [map_name, 0])),
    );
    const player_data = [];
    const keys = [];
    for (const [key, value] of Object.entries(draftPickData).sort(([_ka, a], [_kb, b]) => b - a)) {
        player_data.push(value);
        keys.push(key);
    }

    const style = getComputedStyle(document.body);
    const options = merge(MapChartConfig(style), FilterLegendConfig(style, filter, false), {
        plugins: {
            title: { display: true, text: 'Maps bans' },
            tooltip: { enables: true },
        },
        scale: {
            x: {
                stacked: true
            },
            y: {
                stacked: true
            }
        }
    });
    return <Chart data={{
        datasets: [{
            data: player_data,
            backgroundColor: player_data.map((_v, i) => i % 2 === 0 ? style.getPropertyValue('--ifm-color-primary-darkest') : style.getPropertyValue('--ifm-color-secondary-darkest')),
            borderColor: player_data.map((_v, i) => i % 2 === 0 ? style.getPropertyValue('--ifm-color-primary-light') : style.getPropertyValue('--ifm-color-secondary-light')),
            borderWidth: 2,
            label: "Bans"
        }], labels: keys
    }} options={options}></Chart>;
};
