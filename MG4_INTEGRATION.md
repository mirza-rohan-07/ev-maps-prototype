# MG4 Integration Guide

This document provides detailed instructions for connecting your real MG4 to the EV Maps prototype.

## 🔌 Connection Methods

### Method 1: OBD-II Connection (Recommended)

#### Hardware Requirements
- OBD-II Bluetooth/WiFi adapter (compatible with MG4)
- Smartphone or tablet with Bluetooth/WiFi capability

#### Recommended OBD-II Adapters
- **Vgate iCar Pro**: Bluetooth 4.0, supports MG4 protocols
- **OBDLink MX+**: Advanced features, reliable connection
- **Veepeak OBDCheck**: Budget-friendly option

#### Setup Instructions
1. **Connect OBD-II adapter** to your MG4's diagnostic port (usually under the dashboard)
2. **Pair the adapter** with your device via Bluetooth or WiFi
3. **Install OBD-II app** (e.g., Torque Pro, OBD Fusion)
4. **Configure the app** to read MG4-specific PIDs

#### MG4 OBD-II PIDs
```javascript
// Battery and Electric Vehicle PIDs
const MG4_PIDS = {
  BATTERY_LEVEL: '0x5B',        // Battery level percentage
  BATTERY_TEMP: '0x5C',         // Battery temperature
  MOTOR_TEMP: '0x5D',           // Motor temperature
  CHARGING_STATUS: '0x5E',      // Charging status
  CHARGING_RATE: '0x5F',        // Charging rate (kW)
  RANGE_ESTIMATE: '0x60',       // Estimated range
  EFFICIENCY: '0x61',           // Current efficiency (km/kWh)
  POWER_CONSUMPTION: '0x62',    // Power consumption (kW)
  REGEN_BRAKING: '0x63',        // Regenerative braking level
  VEHICLE_SPEED: '0x0D',        // Vehicle speed
  MOTOR_RPM: '0x0C',            // Motor RPM
  BATTERY_VOLTAGE: '0x42',      // Battery voltage
  BATTERY_CURRENT: '0x43',      // Battery current
};
```

### Method 2: MG4 Mobile App API

#### Requirements
- MG4 mobile app installed and configured
- API access credentials (contact MG Motor support)
- Network connectivity

#### API Endpoints
```javascript
// Example API endpoints (actual endpoints may vary)
const MG4_API_ENDPOINTS = {
  VEHICLE_STATUS: '/api/v1/vehicle/status',
  BATTERY_INFO: '/api/v1/vehicle/battery',
  LOCATION: '/api/v1/vehicle/location',
  CHARGING_STATUS: '/api/v1/vehicle/charging',
  TRIP_DATA: '/api/v1/vehicle/trip',
  MAINTENANCE: '/api/v1/vehicle/maintenance',
};
```

#### Authentication
```javascript
// Example authentication header
const headers = {
  'Authorization': `Bearer ${MG4_API_TOKEN}`,
  'Content-Type': 'application/json',
  'X-Vehicle-ID': 'YOUR_MG4_VIN',
};
```

### Method 3: CAN Bus Direct Connection

#### Hardware Requirements
- CAN bus interface (e.g., CANable, USB2CAN)
- CAN bus cable and connectors
- Technical knowledge of MG4 CAN bus protocol

#### CAN Bus Messages
```javascript
// MG4 CAN Bus Message IDs (example)
const MG4_CAN_IDS = {
  BATTERY_MODULE: '0x123',      // Battery management system
  MOTOR_CONTROLLER: '0x456',    // Motor control unit
  BMS: '0x789',                 // Battery management system
  CHARGER: '0xABC',             // On-board charger
  VCU: '0xDEF',                 // Vehicle control unit
};
```

## 📊 Data Mapping

### Battery System Data
```javascript
// Battery data structure
const batteryData = {
  level: 85,                    // Percentage (0-100)
  range: 245,                   // Estimated range in km
  temperature: 22,              // Battery temperature in °C
  voltage: 400,                 // Battery voltage in V
  current: 15,                  // Battery current in A
  chargingStatus: 'not_charging', // charging, not_charging, fast_charging
  chargingRate: 0,              // Charging rate in kW
  estimatedTimeToFull: 0,       // Estimated time to full charge in minutes
  health: 95,                   // Battery health percentage
};
```

### Performance Data
```javascript
// Performance data structure
const performanceData = {
  efficiency: 4.2,              // Current efficiency in km/kWh
  powerConsumption: 15,         // Current power consumption in kW
  speed: 60,                    // Current speed in km/h
  acceleration: 0.5,            // Current acceleration in m/s²
  regenBraking: 0.3,            // Regenerative braking level (0-1)
  motorRPM: 3000,               // Motor RPM
  motorTemperature: 45,         // Motor temperature in °C
};
```

### Location Data
```javascript
// Location data structure
const locationData = {
  lat: 51.5074,                 // Latitude
  lng: -0.1278,                 // Longitude
  heading: 180,                 // Heading in degrees
  altitude: 35,                 // Altitude in meters
  speed: 60,                    // GPS speed in km/h
  accuracy: 5,                  // GPS accuracy in meters
  timestamp: Date.now(),        // Timestamp
};
```

### Maintenance Data
```javascript
// Maintenance data structure
const maintenanceData = {
  tirePressure: {
    frontLeft: 2.4,             // Front left tire pressure in bar
    frontRight: 2.4,            // Front right tire pressure in bar
    rearLeft: 2.3,              // Rear left tire pressure in bar
    rearRight: 2.3,             // Rear right tire pressure in bar
  },
  lastService: '2024-01-15',    // Last service date
  nextService: '2024-07-15',    // Next service date
  errorCodes: [],               // Active error codes
  serviceHistory: [],           // Service history
};
```

## 🔧 Implementation Steps

### Step 1: Choose Connection Method
1. **For beginners**: Use OBD-II connection
2. **For developers**: Use API connection
3. **For advanced users**: Use CAN bus connection

### Step 2: Configure Environment Variables
Create a `.env` file in the project root:
```env
# OBD-II Configuration
REACT_APP_OBD_DEVICE_NAME=MG4_OBD
REACT_APP_OBD_PROTOCOL=ISO15765-4_11bit_500k

# API Configuration
REACT_APP_MG4_API_URL=https://mg4-api.example.com
REACT_APP_MG4_API_TOKEN=your_api_token_here
REACT_APP_MG4_VIN=your_vehicle_vin

# CAN Bus Configuration
REACT_APP_CAN_INTERFACE=can0
REACT_APP_CAN_BITRATE=500000
```

### Step 3: Update Service Configuration
Modify `src/services/MG4Service.js`:
```javascript
// Choose your connection method
const connectionType = 'obd'; // or 'api', 'can', 'simulation'

// Initialize connection
await mg4Service.connect(connectionType);
```

### Step 4: Test Connection
```javascript
// Test the connection
const status = mg4Service.getConnectionStatus();
console.log('Connection status:', status);

// Set up data callback
mg4Service.setDataUpdateCallback((data) => {
  console.log('MG4 data received:', data);
  // Update your app state here
});
```

## 🛠️ Troubleshooting

### Common Issues

#### OBD-II Connection Issues
- **Device not found**: Check Bluetooth/WiFi pairing
- **No data received**: Verify PID compatibility with MG4
- **Connection drops**: Check adapter power and signal strength

#### API Connection Issues
- **Authentication failed**: Verify API token and permissions
- **Rate limiting**: Implement proper request throttling
- **Network errors**: Check internet connectivity and firewall settings

#### CAN Bus Issues
- **Interface not found**: Verify CAN interface configuration
- **Message parsing errors**: Check CAN message format and IDs
- **Hardware compatibility**: Ensure CAN interface supports MG4 protocol

### Debug Mode
Enable debug logging:
```javascript
// Enable debug mode
localStorage.setItem('MG4_DEBUG', 'true');

// Check debug logs
console.log('MG4 Service Debug:', mg4Service.getConnectionStatus());
```

## 📱 Mobile Integration

### React Native Version
For mobile deployment, consider creating a React Native version:
```bash
npx react-native init EVMapsMobile
cd EVMapsMobile
npm install react-native-ble-plx  # For OBD-II
npm install react-native-maps     # For maps
```

### Progressive Web App (PWA)
The current web version can be installed as a PWA:
```javascript
// Add to public/manifest.json
{
  "name": "EV Maps",
  "short_name": "EV Maps",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#3e6ae1"
}
```

## 🔒 Security Considerations

### Data Privacy
- **Local processing**: Process sensitive data locally when possible
- **Encryption**: Use HTTPS for all API communications
- **Token management**: Securely store and rotate API tokens
- **Data retention**: Implement data retention policies

### Vehicle Security
- **Read-only access**: Ensure the app only reads data, doesn't write
- **Connection limits**: Limit concurrent connections
- **Timeout handling**: Implement proper connection timeouts
- **Error handling**: Gracefully handle connection failures

## 📈 Performance Optimization

### Data Polling
```javascript
// Optimize polling frequency based on data type
const pollingConfig = {
  battery: 5000,      // Poll every 5 seconds
  location: 1000,     // Poll every 1 second
  performance: 2000,  // Poll every 2 seconds
  maintenance: 30000, // Poll every 30 seconds
};
```

### Caching
```javascript
// Implement data caching
const cache = new Map();
const cacheTimeout = 30000; // 30 seconds

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cacheTimeout) {
    return cached.data;
  }
  return null;
};
```

## 🚀 Next Steps

1. **Choose your connection method** based on your technical expertise
2. **Set up the hardware/API** according to the instructions above
3. **Configure the environment** with your specific settings
4. **Test the connection** using the provided debugging tools
5. **Deploy the application** to your preferred platform
6. **Monitor and optimize** performance based on real-world usage

## 📞 Support

For technical support:
- Check the troubleshooting section above
- Review the console logs for error messages
- Contact MG Motor support for vehicle-specific issues
- Create an issue in the project repository

## 📚 Additional Resources

- [MG4 Owner's Manual](https://www.mgmotor.co.uk/owners/mg4)
- [OBD-II Protocol Documentation](https://en.wikipedia.org/wiki/OBD-II_PIDs)
- [CAN Bus Protocol](https://en.wikipedia.org/wiki/CAN_bus)
- [React Native Documentation](https://reactnative.dev/)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/) 