import React, { useEffect, useState, useRef } from 'react';
import './TradingChart.css';
import { ColorType, createChart } from 'lightweight-charts';
import axios from 'axios';

export const ChartComponent = (props) => {
    const [activeDuration, setActiveDuration] = useState('1m');
    const [chart, setChart] = useState(null);
    const chartContainerRef = useRef(null);

    const {
        selectedCoin,
        colors: {
            backgroundColor = '#0E0E0F',
            textColor = '#0E0E0F',
            upColor = '#21DB9A',
            downColor = '#ff0000',
            wickUpColor = '#21DB9A',
            wickDownColor = '#ff0000',
        } = {},
    } = props;

    const processData = async (newData) => {
        try {
            const transformedData = newData.map((item) => ({
                open: parseFloat(item[1]),
                high: parseFloat(item[2]),
                low: parseFloat(item[3]),
                close: parseFloat(item[4]),
                time: item[0] / 1000,
            }));

            transformedData.sort((a, b) => a.time - b.time);

            return transformedData;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(
                `https://api.binance.com/api/v3/klines?symbol=${
                    selectedCoin === null ? 'BTC' : selectedCoin.symbol.toUpperCase()
                }USDT&interval=1m&limit=1000`
            );
            return processData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const initializeChart = () => {
        const newChart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            grid: {
                vertLines: {
                    visible: false,
                },
                horzLines: {
                    color: '#3C3C3C',
                },
            },
            rightPriceScale: {
                borderVisible: false,
                textColor: '#AAA',
            },
            localization: {
                priceFormatter: (price) => '$ ' + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
            },
            timeScale: {
                fixLeftEdge: true,
                borderVisible: false,
            },
        });

        const newSeries = newChart.addCandlestickSeries({
            upColor,
            downColor,
            borderVisible: false,
            wickUpColor,
            wickDownColor,
        });

        setChart({ instance: newChart, series: newSeries });
    };

    const updateChart = async () => {
        if (!chart || !chart.instance) {
            return;
        }

        try {
            chart.instance.timeScale().fitContent();
            chart.series.setData(await fetchData());
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    };

    useEffect(() => {
        if (!chart) {
            initializeChart();
        } else {
            updateChart();
        }
    }, [selectedCoin]);

    useEffect(() => {
        // Cleanup function
        return () => {
            if (chart && chart.instance) {
                chart.instance.removeSeries(chart.series);
                chart.instance.remove();
            }
        };
    }, []);

    const updateChartDuration = async (duration) => {
        setActiveDuration(duration);
        let interval = '1m';
        if (duration === '1m') {
            interval = '1m';
        } else if (duration === '1d') {
            interval = '1d';
        } else if (duration === '1w') {
            interval = '1w';
        }
        try {
            const res = await axios.get(
                `https://api.binance.com/api/v3/klines?symbol=${
                    selectedCoin === null ? 'BTC' : selectedCoin.symbol.toUpperCase()
                }USDT&interval=${interval}&limit=1000`
            );
            const data = await processData(res.data);
            chart.series.setData(data);
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <div id="chartDiv">
            <div className="buttonDiv">
                <button
                    onClick={() => updateChartDuration('1m')}
                    className={`durationButton ${activeDuration === '1m' ? 'active' : ''}`}
                >
                    1m
                </button>
                <button
                    onClick={() => updateChartDuration('1d')}
                    className={`durationButton ${activeDuration === '1d' ? 'active' : ''}`}
                >
                    1d
                </button>
                <button
                    onClick={() => updateChartDuration('1w')}
                    className={`durationButton ${activeDuration === '1w' ? 'active' : ''}`}
                >
                    1w
                </button>
            </div>
            <div id="tchart" ref={chartContainerRef} />
        </div>
    );
};

export function TradingChart(props) {
    return <ChartComponent {...props}></ChartComponent>;
}
