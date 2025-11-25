import Chart from "./chart";
import { mapDraftNameToDisplay, tournamentMaps } from "@site/src/data/mapping";
import MapChartConfig from "@site/src/utils/map-chart-config";
import useDelayedColorMode from "@site/src/utils/use-delayed-color-mode";
import { merge } from 'lodash-es';
import { Filter } from "../filter/filter-dialog";
import { FilterLegendConfig } from "@site/src/utils/civ-chart-config";

export default function MapPickChart({ draftsData, filter }: { draftsData: { mapDrafts: any[] }, filter: Filter }): JSX.Element {
    useDelayedColorMode();
    const draftPickData: { [key: string]: { player: number, admin: number } } = draftsData.mapDrafts.reduce(
        (acc, draft) => {
            const mapPicks = draft.draft.filter(v => v.action === 'pick');
            for (const pick of mapPicks) {
                const mapName = mapDraftNameToDisplay(pick.map);
                if (!acc.hasOwnProperty(mapName)) {
                    acc[mapName] = { "player": 0, "admin": 0 };
                }
                acc[mapName][pick.type] = acc[mapName][pick.type] + 1;
            }
            return acc;
        },
        Object.fromEntries(tournamentMaps.map(map_name => [map_name, { admin: 0, player: 0 }])),
    );
    const player_data = [];
    const admin_data = [];
    const keys = [];
    for (const [key, value] of Object.entries(draftPickData).sort(([k, a], [ka, b]) => b.admin + b.player - a.admin - a.player)) {
        player_data.push(value.player);
        admin_data.push(value.admin);
        keys.push(key);
    }

    const style = getComputedStyle(document.body);
    const options = merge(MapChartConfig(style), FilterLegendConfig(style, filter, false), {
        plugins: {
            title: { display: true, text: 'Maps picks' },
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
                label: 'Player picks',
                data: player_data,
                backgroundColor: style.getPropertyValue('--ifm-color-primary')
            },
            {
                label: 'Admin picks',
                data: admin_data,
                backgroundColor: style.getPropertyValue('--ifm-color-primary-lightest')
            },
        ],
        labels: keys
    }} options={options}></Chart>;
};
