import React from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './../aws-exports';
import { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

Amplify.configure(awsconfig);

// Apply plugin with configuration
Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: 'eu-west-1',
    aws_pubsub_endpoint: 'wss://a2mrsxwmzefujy-ats.iot.eu-west-1.amazonaws.com/mqtt',
}));

class Sensors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sensorMsg: '{"null": 0}',
        };
    }

    componentDidMount() {
        PubSub.subscribe('device/12/data').subscribe({
            next: data => {
                try {
                    this.setState({ sensorMsg: data.value });
                } catch (error) {
                    console.log("Error, are you sending the correct data?");
                }
            },
            error: error => console.error(error),
            close: () => console.log('Done'),
        });
    }

    render() {
        const { sensorMsg } = this.state;
        let sensorData = parseFloat(sensorMsg.temperature);
        if (!isNaN(sensorData)) {
            sensorData = sensorData.toFixed(2); // Format to two decimal places
        }

        return (
            <>
                {sensorData}°C 
            </>
        )
    }
}

export default Sensors;
