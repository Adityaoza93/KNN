import React from 'react';
import { PubSub } from 'aws-amplify';

class XYZSensors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sensorData: {
                xaxis: 0,
                yaxis: 0,
                zaxis: 0,
            }
        };
    }

    componentDidMount() {
        PubSub.subscribe('device/12/data').subscribe({
            next: data => {
                try {
                    console.log("Received raw data:", data.value); // Debugging line
                    const parsedData = data.value; // No need to parse
                    console.log("Parsed data:", parsedData); // Debugging line
                    const { xaxis, yaxis, zaxis } = parsedData;
                    this.setState({ 
                        sensorData: {
                            xaxis: xaxis || 0,
                            yaxis: yaxis || 0,
                            zaxis: zaxis || 0,
                        }
                    }, () => {
                        console.log("State updated:", this.state.sensorData); // Debugging line
                    });
                } catch (error) {
                    console.log("Error parsing data:", error);
                }
            },
            error: error => {
                console.error("Subscription error:", error);
            },
            close: () => {
                console.log('Subscription closed');
            },
        });
    }

    render() {
        const { sensorData } = this.state;

        return (
            <>
               X-axis: {sensorData.xaxis.toFixed(2)}<br/> 
               Y-axis: {sensorData.yaxis.toFixed(2)}<br/>
               Z-axis: {sensorData.zaxis.toFixed(2)}
            </>
        )
    }
}

export default XYZSensors;
