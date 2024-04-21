import React from 'react';
import Card from 'react-bootstrap/Card';
import { Amplify, PubSub } from 'aws-amplify';
import awsconfig from './../aws-exports';

Amplify.configure(awsconfig);

class HumiditySensor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            humidity: 0
        };
    }

    componentDidMount() {
        PubSub.subscribe('device/12/data').subscribe({
            next: data => {
                console.log("Received data:", data.value); // Log the received data
                try {
                    const humidity = parseFloat(data.value.humidity);
                    if (!isNaN(humidity)) {
                        this.setState({ humidity: humidity.toFixed(2) }); // Format to two decimal places
                    }
                } catch (error) {
                    console.log("Error parsing the data:", error);
                }
            },
            error: error => console.error(error),
            close: () => console.log('Done'),
        });
    }

    render() {
        const { humidity } = this.state;

        return (
            <>
                {humidity}%
            </>          
        );
    }
}

export default HumiditySensor;
