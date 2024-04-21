import React, { useEffect, useState } from 'react';
import { PubSub } from 'aws-amplify';

function AmbientSensor() {
    const [ambientTemp, setAmbientTemp] = useState(0);

    useEffect(() => {
        const subscription = PubSub.subscribe('device/12/data').subscribe({
            next: data => {
                try {
                    const sensorData = typeof data.value === 'object' ? data.value : JSON.parse(data.value);
                    const temp = parseFloat(sensorData.ambienttemperature);
                    if (!isNaN(temp)) {
                        setAmbientTemp(temp.toFixed(2)); // Format to two decimal places
                    }
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

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div>
            {ambientTemp}&deg;C
        </div>
    );
}

export default AmbientSensor;
