import { useState, useEffect, useRef, forwardRef } from 'react';
import './App.css';
import axios from 'axios';
import { createChart, LineSeries } from 'lightweight-charts';

const Chart = ({ chartData: chartData, isChart: isChart, setIsChart: setIsChart }) => {
  const chartRef = useRef(null);

  if (isChart) {
    chartRef.current = null;
  }

  useEffect(() => {
    if (!chartRef.current || !chartData) {
      return;
    }

    const chart = createChart(chartRef.current, {
      width: 600,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      }
    });

    const lineSeries = chart.addSeries(LineSeries, {});

    const sortedData = chartData.slice().sort((a, b) => a.time - b.time);
    lineSeries.setData(sortedData);
    chart.timeScale().fitContent();
    setIsChart(true);
  }, [chartData]);

  return <div ref={chartRef}></div>

}

function App() {
  const [chartData, setChartData] = useState();
  const [isData, setIsData] = useState(false);
  const [isChart, setIsChart] = useState(false);

  const handleButtonClick = () => {
    const params = new URLSearchParams({
      category: 'linear',
      symbol: 'BTCUSDT',
      interval: '5',
      limit: '40'

    });
    axios.get(`https://api-testnet.bybit.com/v5/market/kline?${params.toString()}`)
      .then((response) => {
        const list = response?.data?.result?.list;
        const data = Object.values(list).map((item) => ({
          time: Math.round(Number(item[0]) / 1000),
          value: Number(item[3])
        }));
        setChartData(data);
        setIsData(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <button onClick={handleButtonClick}>some button</button>
      {!isData && !isChart ? <p>клик сам батон</p> : <Chart chartData={chartData} setIsChart={setIsChart} isChart={isChart}></Chart>}
    </div>
  );
}

export default App;
