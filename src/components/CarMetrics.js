import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCarData } from '../contexts/CarDataContext';
import { Battery, Zap, Gauge, Thermometer, Settings, RotateCcw } from 'lucide-react';

const MetricsContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
`;

const MetricsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const HeaderTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ResetButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(20px);
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const MetricIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.color || 'linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%)'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const MetricTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
`;

const MetricUnit = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  backdrop-filter: blur(20px);
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px 0;
`;

const TirePressureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const TirePressureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
`;

const TireLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TireValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
`;

const TireStatus = styled.div`
  font-size: 10px;
  color: ${props => props.status === 'good' ? '#4ade80' : props.status === 'warning' ? '#fbbf24' : '#ef4444'};
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Mock data for charts
const generateMockData = (count = 20) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      time: i,
      battery: 85 - (i * 0.5) + (Math.random() - 0.5) * 2,
      efficiency: 4.2 + (Math.random() - 0.5) * 0.4,
      temperature: 22 + (Math.random() - 0.5) * 4,
      power: Math.max(0, 15 + (Math.random() - 0.5) * 10)
    });
  }
  return data;
};

const CarMetrics = () => {
  const { carData, resetTripData } = useCarData();
  const chartData = generateMockData();

  const getTireStatus = (pressure) => {
    if (pressure >= 2.2 && pressure <= 2.6) return 'good';
    if (pressure >= 2.0 && pressure <= 2.8) return 'warning';
    return 'low';
  };

  const getTireStatusText = (status) => {
    switch (status) {
      case 'good': return 'Good';
      case 'warning': return 'Check';
      case 'low': return 'Low';
      default: return 'Unknown';
    }
  };

  return (
    <MetricsContainer>
      <MetricsHeader>
        <HeaderTitle>Car Metrics</HeaderTitle>
        <ResetButton onClick={resetTripData}>
          <RotateCcw size={14} />
          Reset Trip
        </ResetButton>
      </MetricsHeader>

      <MetricsGrid>
        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MetricHeader>
            <MetricIcon color="linear-gradient(135deg, #4ade80 0%, #22c55e 100%)">
              <Battery size={16} />
            </MetricIcon>
            <MetricTitle>Battery Level</MetricTitle>
          </MetricHeader>
          <MetricValue>{carData.currentBattery.toFixed(1)}%</MetricValue>
          <MetricUnit>Remaining</MetricUnit>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <MetricHeader>
            <MetricIcon color="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)">
              <Zap size={16} />
            </MetricIcon>
            <MetricTitle>Efficiency</MetricTitle>
          </MetricHeader>
          <MetricValue>{carData.efficiency.toFixed(1)}</MetricValue>
          <MetricUnit>km/kWh</MetricUnit>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <MetricHeader>
            <MetricIcon color="linear-gradient(135deg, #3e6ae1 0%, #3451b2 100%)">
              <Gauge size={16} />
            </MetricIcon>
            <MetricTitle>Range</MetricTitle>
          </MetricHeader>
          <MetricValue>{carData.currentRange.toFixed(0)}</MetricValue>
          <MetricUnit>km</MetricUnit>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <MetricHeader>
            <MetricIcon color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
              <Thermometer size={16} />
            </MetricIcon>
            <MetricTitle>Temperature</MetricTitle>
          </MetricHeader>
          <MetricValue>{carData.temperature.toFixed(1)}°C</MetricValue>
          <MetricUnit>Cabin</MetricUnit>
        </MetricCard>
      </MetricsGrid>

      <ChartContainer>
        <ChartTitle>Battery & Efficiency Over Time</ChartTitle>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="battery" 
              stroke="#4ade80" 
              fill="url(#batteryGradient)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#fbbf24" 
              fill="url(#efficiencyGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Tire Pressure</ChartTitle>
        <TirePressureGrid>
          <TirePressureCard>
            <TireLabel>Front Left</TireLabel>
            <TireValue>{carData.tirePressure.frontLeft} bar</TireValue>
            <TireStatus status={getTireStatus(carData.tirePressure.frontLeft)}>
              {getTireStatusText(getTireStatus(carData.tirePressure.frontLeft))}
            </TireStatus>
          </TirePressureCard>
          <TirePressureCard>
            <TireLabel>Front Right</TireLabel>
            <TireValue>{carData.tirePressure.frontRight} bar</TireValue>
            <TireStatus status={getTireStatus(carData.tirePressure.frontRight)}>
              {getTireStatusText(getTireStatus(carData.tirePressure.frontRight))}
            </TireStatus>
          </TirePressureCard>
          <TirePressureCard>
            <TireLabel>Rear Left</TireLabel>
            <TireValue>{carData.tirePressure.rearLeft} bar</TireValue>
            <TireStatus status={getTireStatus(carData.tirePressure.rearLeft)}>
              {getTireStatusText(getTireStatus(carData.tirePressure.rearLeft))}
            </TireStatus>
          </TirePressureCard>
          <TirePressureCard>
            <TireLabel>Rear Right</TireLabel>
            <TireValue>{carData.tirePressure.rearRight} bar</TireValue>
            <TireStatus status={getTireStatus(carData.tirePressure.rearRight)}>
              {getTireStatusText(getTireStatus(carData.tirePressure.rearRight))}
            </TireStatus>
          </TirePressureCard>
        </TirePressureGrid>
      </ChartContainer>
    </MetricsContainer>
  );
};

export default CarMetrics; 