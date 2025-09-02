// MG4 Data Integration Service
// This service handles all communication with the MG4 vehicle

class MG4Service {
  constructor() {
    this.isConnected = false;
    this.connectionType = null;
    this.dataInterval = null;
    this.onDataUpdate = null;
  }

  // Initialize connection to MG4
  async connect(connectionType = 'simulation') {
    try {
      this.connectionType = connectionType;
      
      switch (connectionType) {
        case 'obd':
          await this.connectOBD();
          break;
        case 'api':
          await this.connectAPI();
          break;
        case 'can':
          await this.connectCAN();
          break;
        case 'simulation':
        default:
          await this.startSimulation();
          break;
      }
      
      this.isConnected = true;
      console.log(`MG4 connected via ${connectionType}`);
      return true;
    } catch (error) {
      console.error('MG4 connection failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  // OBD-II Connection
  async connectOBD() {
    // This would integrate with an OBD-II library
    // Example: obd-ii, node-obd, or similar
    
    try {
      // Simulate OBD connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Start reading OBD data
      this.startOBDDataReading();
      
    } catch (error) {
      throw new Error(`OBD connection failed: ${error.message}`);
    }
  }

  // MG4 Mobile App API Connection
  async connectAPI() {
    const apiUrl = process.env.REACT_APP_MG4_API_URL;
    const apiToken = process.env.REACT_APP_MG4_API_TOKEN;
    
    if (!apiUrl || !apiToken) {
      throw new Error('MG4 API credentials not configured');
    }
    
    try {
      // Test API connection
      const response = await fetch(`${apiUrl}/vehicle/status`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      // Start API polling
      this.startAPIPolling();
      
    } catch (error) {
      throw new Error(`API connection failed: ${error.message}`);
    }
  }

  // CAN Bus Connection
  async connectCAN() {
    // This would integrate with CAN bus hardware
    // Example: socketcan, can-utils, or similar
    
    try {
      // Simulate CAN connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Start reading CAN data
      this.startCANDataReading();
      
    } catch (error) {
      throw new Error(`CAN connection failed: ${error.message}`);
    }
  }

  // Simulation Mode (for development)
  async startSimulation() {
    console.log('Starting MG4 simulation mode');
    
    // Start simulated data updates
    this.dataInterval = setInterval(() => {
      const simulatedData = this.generateSimulatedData();
      if (this.onDataUpdate) {
        this.onDataUpdate(simulatedData);
      }
    }, 2000);
  }

  // Generate simulated MG4 data
  generateSimulatedData() {
    const baseData = {
      battery: {
        level: Math.max(0, Math.min(100, 85 + (Math.random() - 0.5) * 0.1)),
        range: Math.max(0, 245 + (Math.random() - 0.5) * 0.5),
        temperature: 22 + (Math.random() - 0.5) * 0.2,
        chargingStatus: 'not_charging',
        chargingRate: 0,
        estimatedTimeToFull: 0
      },
      performance: {
        efficiency: Math.max(3.5, Math.min(5.0, 4.2 + (Math.random() - 0.5) * 0.1)),
        powerConsumption: Math.max(0, 15 + (Math.random() - 0.5) * 10),
        speed: Math.max(0, 60 + (Math.random() - 0.5) * 20),
        acceleration: Math.random() * 2 - 1
      },
      location: {
        lat: 51.5074 + (Math.random() - 0.5) * 0.001,
        lng: -0.1278 + (Math.random() - 0.5) * 0.001,
        heading: (Math.random() * 360),
        altitude: 35 + (Math.random() - 0.5) * 10
      },
      maintenance: {
        tirePressure: {
          frontLeft: 2.4 + (Math.random() - 0.5) * 0.1,
          frontRight: 2.4 + (Math.random() - 0.5) * 0.1,
          rearLeft: 2.3 + (Math.random() - 0.5) * 0.1,
          rearRight: 2.3 + (Math.random() - 0.5) * 0.1
        },
        lastService: '2024-01-15',
        nextService: '2024-07-15',
        errorCodes: []
      },
      trip: {
        distance: 0,
        efficiency: 0,
        averageSpeed: 0,
        startTime: null
      }
    };

    return baseData;
  }

  // OBD Data Reading
  startOBDDataReading() {
    this.dataInterval = setInterval(async () => {
      try {
        // Read OBD PIDs (Parameter IDs)
        const data = await this.readOBDPIDs([
          '0x5B', // Battery level
          '0x5C', // Engine coolant temperature
          '0x0D', // Vehicle speed
          '0x0C', // Engine RPM
          '0x05', // Engine coolant temperature
          '0x0F', // Intake air temperature
        ]);
        
        if (this.onDataUpdate) {
          this.onDataUpdate(this.parseOBDData(data));
        }
      } catch (error) {
        console.error('OBD data reading error:', error);
      }
    }, 1000);
  }

  // API Polling
  startAPIPolling() {
    this.dataInterval = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_MG4_API_URL}/vehicle/status`, {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_MG4_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (this.onDataUpdate) {
            this.onDataUpdate(this.parseAPIData(data));
          }
        }
      } catch (error) {
        console.error('API polling error:', error);
      }
    }, 5000); // Poll every 5 seconds
  }

  // CAN Data Reading
  startCANDataReading() {
    this.dataInterval = setInterval(async () => {
      try {
        // Read CAN messages
        const canData = await this.readCANMessages([
          '0x123', // Battery module
          '0x456', // Motor controller
          '0x789', // BMS (Battery Management System)
        ]);
        
        if (this.onDataUpdate) {
          this.onDataUpdate(this.parseCANData(canData));
        }
      } catch (error) {
        console.error('CAN data reading error:', error);
      }
    }, 100);
  }

  // Parse OBD data
  parseOBDData(obdData) {
    return {
      battery: {
        level: this.parseOBDValue(obdData['0x5B'], 0, 100),
        temperature: this.parseOBDValue(obdData['0x5C'], -40, 215) - 40,
        chargingStatus: 'not_charging',
        chargingRate: 0
      },
      performance: {
        speed: this.parseOBDValue(obdData['0x0D'], 0, 255),
        efficiency: 4.2, // Calculate from power consumption
        powerConsumption: this.calculatePowerConsumption(obdData)
      },
      location: {
        lat: 51.5074,
        lng: -0.1278,
        heading: 0,
        altitude: 35
      }
    };
  }

  // Parse API data
  parseAPIData(apiData) {
    return {
      battery: {
        level: apiData.battery?.level || 85,
        range: apiData.battery?.range || 245,
        temperature: apiData.battery?.temperature || 22,
        chargingStatus: apiData.battery?.chargingStatus || 'not_charging',
        chargingRate: apiData.battery?.chargingRate || 0
      },
      performance: {
        efficiency: apiData.performance?.efficiency || 4.2,
        powerConsumption: apiData.performance?.powerConsumption || 0,
        speed: apiData.performance?.speed || 0
      },
      location: {
        lat: apiData.location?.lat || 51.5074,
        lng: apiData.location?.lng || -0.1278,
        heading: apiData.location?.heading || 0,
        altitude: apiData.location?.altitude || 35
      }
    };
  }

  // Parse CAN data
  parseCANData(canData) {
    return {
      battery: {
        level: this.parseCANBatteryLevel(canData['0x123']),
        temperature: this.parseCANTemperature(canData['0x789']),
        chargingStatus: this.parseCANChargingStatus(canData['0x123']),
        chargingRate: this.parseCANChargingRate(canData['0x123'])
      },
      performance: {
        speed: this.parseCANSpeed(canData['0x456']),
        efficiency: this.calculateEfficiency(canData),
        powerConsumption: this.parseCANPower(canData['0x456'])
      },
      location: {
        lat: 51.5074,
        lng: -0.1278,
        heading: 0,
        altitude: 35
      }
    };
  }

  // Utility methods for data parsing
  parseOBDValue(value, min, max) {
    if (!value) return min;
    return Math.max(min, Math.min(max, parseInt(value, 16)));
  }

  parseCANBatteryLevel(canMessage) {
    if (!canMessage) return 85;
    // Parse battery level from CAN message (example)
    const batteryByte = canMessage.data[1];
    return (batteryByte / 255) * 100;
  }

  parseCANTemperature(canMessage) {
    if (!canMessage) return 22;
    // Parse temperature from CAN message (example)
    const tempByte = canMessage.data[2];
    return (tempByte - 40); // Convert to Celsius
  }

  parseCANChargingStatus(canMessage) {
    if (!canMessage) return 'not_charging';
    // Parse charging status from CAN message (example)
    const statusByte = canMessage.data[3];
    return statusByte > 0 ? 'charging' : 'not_charging';
  }

  parseCANChargingRate(canMessage) {
    if (!canMessage) return 0;
    // Parse charging rate from CAN message (example)
    const rateBytes = canMessage.data.slice(4, 6);
    return (rateBytes[0] << 8 | rateBytes[1]) / 100; // Convert to kW
  }

  parseCANSpeed(canMessage) {
    if (!canMessage) return 0;
    // Parse speed from CAN message (example)
    const speedBytes = canMessage.data.slice(0, 2);
    return (speedBytes[0] << 8 | speedBytes[1]) / 100; // Convert to km/h
  }

  parseCANPower(canMessage) {
    if (!canMessage) return 0;
    // Parse power consumption from CAN message (example)
    const powerBytes = canMessage.data.slice(2, 4);
    return (powerBytes[0] << 8 | powerBytes[1]) / 100; // Convert to kW
  }

  calculatePowerConsumption(obdData) {
    // Calculate power consumption from various OBD parameters
    const speed = this.parseOBDValue(obdData['0x0D'], 0, 255);
    const rpm = this.parseOBDValue(obdData['0x0C'], 0, 8000);
    
    // Simplified power calculation (real implementation would be more complex)
    return (speed * 0.1) + (rpm * 0.001);
  }

  calculateEfficiency(canData) {
    // Calculate efficiency from power and speed data
    const power = this.parseCANPower(canData['0x456']);
    const speed = this.parseCANSpeed(canData['0x456']);
    
    if (power <= 0) return 4.2;
    return speed / power; // km/kWh
  }

  // Set data update callback
  setDataUpdateCallback(callback) {
    this.onDataUpdate = callback;
  }

  // Disconnect from MG4
  disconnect() {
    this.isConnected = false;
    
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
      this.dataInterval = null;
    }
    
    console.log('MG4 disconnected');
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      connectionType: this.connectionType
    };
  }
}

// Create singleton instance
const mg4Service = new MG4Service();

export default mg4Service; 