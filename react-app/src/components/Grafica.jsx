import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-moment";
import LoadingScreen from './LoadingScreen.jsx';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const Grafica = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [resultsLimit, setResultsLimit] = useState(20); // Nuevo estado para el límite de resultados
  const chartRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/grafica/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("¡Hubo un error al obtener los datos!", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data initially

    const intervalId = setInterval(fetchData, 60000); // Fetch data every minute

    return () => {
      clearInterval(intervalId); // Clean up interval on component unmount
      // Destruir el gráfico al desmontar el componente
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [id]);

  if (!data) {
    return <LoadingScreen />;
  }

  // Filtrar los resultados según el límite seleccionado
  const limitedData = data.checks.slice(-resultsLimit);

  const chartData = {
    labels: limitedData.map((check) => check.created_at),
    datasets: [
      {
        label: "Tiempo de Respuesta (ms)",
        data: limitedData.map((check) => check.load_time),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y1",
        fill: true,
        tension: 0.1,
      },
      {
        label: "Status Code",
        data: limitedData.map((check) => check.status_code),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y2",
        fill: false,
        type: "line",
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          parser: "YYYY-MM-DDTHH:mm:ss",
          tooltipFormat: "ll HH:mm",
          unit: "day",
          displayFormats: {
            day: "YYYY-MM-DD",
          },
        },
      },
      y1: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        title: {
          display: true,
          text: "Tiempo de Respuesta (ms)",
        },
      },
      y2: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        title: {
          display: true,
          text: "Status Code",
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 100,
        },
      },
    },
  };

  return (
    <div className="container contenedor">
      {/* <img src="./img/logo128x128.png" alt="Logo" className="loading-image" /> */}
      <div className="d-flex justify-content-between text-center datos">
        <div className="derecha">
          <p>{data.availabilityPercentage.toFixed(2)} %</p>
          <p>Disponibilidad</p>
        </div>
        <div className="derecha">
        <p>{(data.averageResponseTime / 1000).toFixed(2)} s</p>
          <p>Tiempo de respuesta</p>
        </div>
        <div>
          <p>{data.totalChecks}</p>
          <p>Verificaciones</p>
        </div>
      </div>
      <div className="results-limit-form">
        <label htmlFor="resultsLimit">Mostrar resultados:</label>
        <select
          id="resultsLimit"
          value={resultsLimit}
          onChange={(e) => setResultsLimit(parseInt(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        {/* <button
          className="btn btn-apli d-inline-flex align-items-center px-2 py-1"
          onClick={fetchData}
        >
          <span className="material-icons">refresh</span>
        </button> */}
      </div>
      {/* <CircularProgressbar
        value={data.availabilityPercentage}
        text={`${data.availabilityPercentage.toFixed(2)}%`}
        className="custom-progressbar"
      /> */}

      <div className="chart-container">
        <h2>{data.url}</h2>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>

      {/* Formulario para seleccionar la cantidad de resultados */}

    </div>
  );
};

export default Grafica;
