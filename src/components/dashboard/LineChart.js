import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        // title: {
        //     display: true,
        //     text: 'Chart.js Line Chart',
        // },
    },
    scales: {
        y: {
            ticks: {
                color: "#A6A8B1",
                font: {
                    size: 10,
                },
                stepSize: 1,
                beginAtZero: true,
            },
        },
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: "#2791B5",

                font: {
                    size: 10,
                },
                stepSize: 1,
                beginAtZero: true,
            },
        },
    },
};



const LineChart = ({ users }) => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const labelData = users?.map((user) => user?.users);
    console.log('labelData', labelData);

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset',
                data: labelData,
                borderColor: '#77FDC4',
                backgroundColor: '#30C384',
                borderWidth: 0.5,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 5,
            },
        ],
    };
    return (
        <>
            <Line options={options} data={data} />
        </>
    );
};

export default LineChart;