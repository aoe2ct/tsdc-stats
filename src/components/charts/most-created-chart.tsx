import { Scatter } from "react-chartjs-2";
import { Chart, PointElement } from 'chart.js'
import useDelayedColorMode from "@site/src/utils/use-delayed-color-mode";
import { BracketNameToImage, bracketColors } from "@site/src/data/mapping";

Chart.register(PointElement);

type Bracket = keyof typeof BracketNameToImage
const bracketOrder = Object.keys(BracketNameToImage) as Bracket[];

export default function MostCreatedChart({ gamesData }: { gamesData: any[] }): JSX.Element {
    useDelayedColorMode();
    let bracketMostCreated: Map<Bracket, Array<{ count: number, name: string, player: string }>> = new Map();
    gamesData.forEach(game => {
        if (!bracketMostCreated.has(game.bracket)) {
            bracketMostCreated.set(game.bracket, []);
        }
        bracketMostCreated.set(game.bracket, [
            ...bracketMostCreated.get(game.bracket),
            { count: game.most_created_count[0], name: game.most_created[0], player: game.players[0] },
            { count: game.most_created_count[1], name: game.most_created[1], player: game.players[1] }
        ]);
    });
    const datasets = bracketOrder.map((bracket, index) => ({
        label: bracket,
        data: (bracketMostCreated.get(bracket) ?? []).map(mostCreated => ({
            x: Math.random() * 0.4 + 0.4,
            y: mostCreated.count,
            name: mostCreated.name,
            player: mostCreated.player
        })),
        xAxisID: `x${index == 0 ? '' : index}`,
        backgroundColor: bracketColors[bracket],
        borderColor: bracketColors[bracket],
    }));

    const style = getComputedStyle(document.body);

    const xLabels = {
        id: 'xLabels',
        beforeDatasetsDraw(chart: Chart<'scatter'>) {
            const { ctx, scales } = chart;
            ctx.save();

            Object.keys(scales).forEach((axis, index) => {
                if (axis == "y") {
                    return;
                }
                ctx.beginPath();
                ctx.strokeStyle = style.getPropertyValue('--ifm-color-emphasis-300');
                ctx.moveTo(scales.x.getPixelForValue(index), scales.x.top);
                ctx.lineTo(scales.x.getPixelForValue(index), scales.x.bottom);
                ctx.stroke();
            });

            chart.data.datasets.forEach(dataset => {
                ctx.fillStyle = style.getPropertyValue('--ifm-color-emphasis-800');
                ctx.textAlign = 'center';
                ctx.fillText(dataset.label, scales[dataset.xAxisID].getPixelForValue(0.5), scales[dataset.xAxisID].bottom + 10);
            });
        }
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Most created unit by bracket',
            },
            legend: {
                display: false,
            },
            tooltip: {
                enables: true,
                callbacks: {
                    label: ({ parsed, raw }) => {
                        return `${raw.name}: ${parsed.y} - ${raw.player}`;
                    },
                },
            },
        },
        layout: {
            padding: {
                bottom: 30
            }
        },
        scales: {
            ...Object.fromEntries(
                bracketOrder.map((_bracket, index) => [
                    `x${index == 0 ? '' : index}`,
                    {
                        beginAtZero: true,
                        max: 1,
                        stack: 'strip',
                        grid: { display: false },
                        ticks: { display: false }
                    }
                ])
            ),
            y: {
                grid: {
                    color: style.getPropertyValue('--ifm-color-emphasis-300'),
                },
                ticks: {
                    color: style.getPropertyValue('--ifm-color-emphasis-800'),
                },
            }
        },
    };
    return <Scatter data={{
        datasets
    }} options={options} plugins={[xLabels]}></Scatter>;
};
