import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);





function calcMean(data, useY) {
    const sum = data.reduce((a, b) => a + (useY ? b.y : b), 0);
    return sum / data.length;
}

// const data_dots = new Array(500).fill(0).map((v, i) => ({ x: i, y: 100 + Math.random() * 100 }));

// const mean = calcMean(data, true);
// const tmp = data.map(p => Math.pow(p.y - mean, 2));
// const variance = calcMean(data.map(p => Math.pow(p.y - mean, 2)));
// const stddev = Math.sqrt(variance);


const mean = 100;
const stddev = 15;

const pdf = (x) => {
    const m = stddev * Math.sqrt(2 * Math.PI);
    const e = Math.exp(-Math.pow(x - mean, 2) / (2 * stddev * stddev));
    return e / m;
};
const bell = [];
const labels = [];
const startX = mean - 3.5 * stddev;
const endX = mean + 3.5 * stddev;
const step = stddev / 12;

let x;
for (x = startX; x <= mean; x += step) {
    bell.push({ x, y: pdf(x) });
    labels.push(x);
}

for (x = mean + step; x <= endX; x += step) {
    bell.push({ x, y: pdf(x) });
    labels.push(x);
}

const bellScore = [];
const score = 129;
for (x = startX; x <= score; x += step) {
    bellScore.push({ x, y: pdf(x) });
}

console.log(bell.length);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            display: false,
        },
        title: {
            display: true,
            text: 'IQ Score Distribution',
            font: {
                size: 16,
                weight: 'bold',
            },
        },
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: true,
            },
            ticks: {
                display: true,
                callback: (value, index, ticks) => {
                    if ((bell[index].x - 10) % 15 === 0) {
                        return bell[index].x;
                    }

                },
            },
        },
        y: {
            display: false,
        },
    },
};


export const data = {
    labels,
    datasets: [
        {
            fill: false,
            label: 'Bell',
            // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            data: bell,
            tension: 0.4,
            radius: 0,
            borderColor: 'rgba(66, 66, 66, 0.2)',
            // backgroundColor: 'rgba(238, 238, 238, 0.5)',
            borderWidth: 2,
            xAxisID:'x',
            yAxisID:'y',

        },
        {
            fill: true,
            label: 'Bell Score',
            // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            data: bellScore,
            tension: 0.4,
            radius: 0,
            borderColor: 'rgba(66, 66, 66, 0.8)',
            backgroundColor: 'rgba(224, 224, 224, 0.5)',
            borderWidth: 2,
            xAxisID:'x',
            yAxisID:'y',

        },
    ],
};

const NormalDistChart = () => {


    return (
        <Line
            options={options}
            data={data}
        />
    );
}

export default NormalDistChart;

