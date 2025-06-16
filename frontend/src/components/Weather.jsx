import React, { useEffect, useState } from 'react';
import team from '../assets/images/team.jpg';

export const Weather = () => {
    let [weatherdata, setweatherdata] = useState(null)

    useEffect(()=>{
        fetch("https://api.open-meteo.com/v1/forecast?latitude=54.7016&longitude=20.2061&current=temperature_2m&forecast_days=3")    
        .then(response=>response.json())
        .then(data=>setweatherdata(data))
    }, [])

    return (
    <div>
        { weatherdata ? (
            <div>{weatherdata.current.temperature_2m}
                </div>
        ) : (
            <div>loading...</div>
        )}
        </div>)
};