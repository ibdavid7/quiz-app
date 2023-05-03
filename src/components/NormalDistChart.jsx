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
import { faker } from '@faker-js/faker';

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
// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const labels = [];
const startX = mean - 3.5 * stddev;
const endX = mean + 3.5 * stddev;
const step = stddev / 7;
let x;
for (x = startX; x <= mean; x += step) {
    bell.push({ x, y: pdf(x) });
    labels.push(x);
}

// labels.push(mean);

for (x = mean; x <= endX; x += step) {
    bell.push({ x, y: pdf(x) });
    labels.push(x);
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
        },
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: true,
            },
            ticks: {
                callback: (value, index, ticks) => {
                    console.log(value, bell[index].x);
                    return index === 25 ? bell[index].x : '';
                },
            },
            // afterBuildTicks(scale) {
            //     scale.ticks = bell.map(p => ({ value: p.x }))
            //         .filter((tick, index) => index % 100 === 0);
            // },
        },
        y: {
            display: true,
            grid: {
                display: false,
            },
            // ticks: {
            //     callback: (value, index, ticks) => {
            //         return value % 100 === 0 ? this.getLabelForValue(value) : '';
            //     },
            // },
        },
    },
};


export const data = {
    labels,
    datasets: [
        {
            fill: true,
            label: 'Dataset 2',
            // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            data: bell,
            tension: 0.4,
            radius: 0,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
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

