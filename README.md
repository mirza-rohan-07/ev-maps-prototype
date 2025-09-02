# EV Maps Prototype - AI-Powered Electric Vehicle Navigation

A Tesla-inspired electric vehicle navigation and charging station finder with real-time MG4 integration.

## 🚗 Features

### Core Features
- **Interactive Map**: Real-time car location tracking with charging station overlay
- **Car Metrics Dashboard**: Live battery, efficiency, and performance monitoring
- **Charging Station Finder**: Filter and sort charging stations by type, availability, and rating
- **AI Route Planner**: Intelligent route optimization with charging stop recommendations
- **Tesla-like UI**: Modern, dark-themed interface with smooth animations

### MG4 Integration
- Real-time battery level and range monitoring
- Live efficiency tracking (km/kWh)
- Tire pressure monitoring
- Temperature and cabin climate data
- Trip statistics and reset functionality
- Charging status and rate monitoring

## 🛠️ Technology Stack

- **Frontend**: React 18, Styled Components, Framer Motion
- **Maps**: Leaflet with React-Leaflet
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Styling**: Tesla-inspired dark theme with glassmorphism effects

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ev-maps-prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔌 MG4 Integration

### Current Implementation
The prototype currently uses simulated MG4 data for development and demonstration purposes. The data includes:

- **Battery Management**: 64 kWh capacity, real-time percentage and range
- **Performance Metrics**: Efficiency tracking, power consumption, temperature
- **Location Services**: GPS coordinates, heading, and speed
- **Maintenance Data**: Tire pressure monitoring, service schedules

### Real MG4 Integration
To connect to your actual MG4, you'll need to implement the following:

#### Option 1: OBD-II Connection
```javascript
// Example OBD-II integration
const connectToMG4 = async () => {
  try {
    // Connect to OBD-II port via Bluetooth/WiFi
    const connection = await obd.connect({
      device: 'MG4_OBD',
      protocol: 'ISO15765-4_11bit_500k'
    });
    
    // Read battery data
    const batteryLevel = await connection.read('BATTERY_LEVEL');
    const range = await connection.read('RANGE_ESTIMATE');
    
    return { batteryLevel, range };
  } catch (error) {
    console.error('MG4 connection failed:', error);
  }
};
```

#### Option 2: MG4 Mobile App API
```javascript
// Example MG4 app API integration
const fetchMG4Data = async () => {
  const response = await fetch('https://mg4-api.example.com/vehicle/status', {
    headers: {
      'Authorization': `Bearer ${MG4_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};
```

#### Option 3: CAN Bus Integration
```javascript
// Example CAN bus data reading
const readCANData = async () => {
  const canData = await canBus.read({
    id: '0x123', // MG4 battery module ID
    length: 8
  });
  
  // Parse battery data from CAN message
  const batteryLevel = parseBatteryLevel(canData);
  return batteryLevel;
};
```

### Required Data Points
For full MG4 integration, you'll need access to:

1. **Battery System**
   - Current battery percentage
   - Estimated range
   - Charging status and rate
   - Battery temperature

2. **Vehicle Performance**
   - Current speed
   - Efficiency (km/kWh)
   - Power consumption
   - Regenerative braking data

3. **Location & Navigation**
   - GPS coordinates
   - Heading/direction
   - Trip distance and time

4. **Maintenance**
   - Tire pressure (all four wheels)
   - Service intervals
   - Error codes and diagnostics

## 🗺️ Map Integration

The application uses Leaflet with a dark theme for optimal visibility. Charging stations are displayed with:

- **Color-coded markers**: Based on charging speed (ultra-fast, fast, standard)
- **Real-time availability**: Live status updates
- **Detailed information**: Power rating, pricing, amenities
- **Range circles**: Visual representation of current range

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the build folder to Netlify
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_MAP_API_KEY=your_map_api_key
REACT_APP_CHARGING_API_KEY=your_charging_station_api_key
REACT_APP_MG4_API_URL=your_mg4_api_endpoint
REACT_APP_MG4_API_TOKEN=your_mg4_api_token
```

### Customization
- **Theme Colors**: Modify `src/styles/GlobalStyles.js`
- **Map Style**: Update TileLayer URL in `src/components/MapView.js`
- **Charging Data**: Replace mock data in components with real API calls

## 📱 Mobile Optimization

The application is fully responsive and optimized for:
- **Tablet displays**: Side panel layout
- **Mobile devices**: Collapsible navigation
- **Touch interactions**: Swipe gestures and touch-friendly buttons

## 🔮 Future Enhancements

### Planned Features
- **Voice Navigation**: AI-powered voice commands
- **Predictive Charging**: Machine learning for optimal charging stops
- **Social Features**: Share routes and charging experiences
- **Offline Mode**: Cached maps and data for poor connectivity
- **Multi-Vehicle Support**: Support for different EV models

### AI Integration
- **Route Optimization**: Machine learning for optimal charging strategies
- **Predictive Maintenance**: AI-powered service recommendations
- **Traffic Integration**: Real-time traffic data for route planning
- **Weather Impact**: Weather-based range adjustments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common issues

## 🙏 Acknowledgments

- Tesla for UI/UX inspiration
- Leaflet for mapping capabilities
- MG Motor for the MG4 platform
- OpenChargeMap for charging station data 