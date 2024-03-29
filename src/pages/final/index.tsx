import React, {useEffect, useState} from 'react';
import './final.scss';
import {Dropdown, Input, Loading} from '@components/ui/common';
import {City_Data, Storage_Key} from '@data/constant';
import {CityType, FormDataType} from '@dtypes/type';
import {calDisWithHaversine} from '@utils/common';
import storage, {StorageType} from '@utils/storage';

const calcDistance = (from: CityType, via: Array<CityType>, to: CityType) => {
    let distance = 0;
    distance += calDisWithHaversine(
        Number(from[1]),
        Number(from[2]),
        Number(via[0][1]),
        Number(via[0][2]),
    );
    for (let idx = 0; idx < via.length; idx++) {
        const prev = via[idx];
        const next = via[idx];
        distance += calDisWithHaversine(
            Number(prev[1]),
            Number(prev[2]),
            Number(next[1]),
            Number(next[2]),
        );
        if (idx === via.length - 2) break;
    }
    distance += calDisWithHaversine(
        Number(via[via.length - 1][1]),
        Number(via[via.length - 1][2]),
        Number(to[1]),
        Number(to[2]),
    );
    return Math.floor(distance * 1000) / 1000;
};
const valid = (data: FormDataType) => {
    const name = 'Dijon';
    let isValid = true;
    if (data.origin_city[0].includes(name)) isValid = false;
    data.intermediate_cities.map((item) => {
        if (item.includes(name)) isValid = false;
    });
    if (data.destination_city[0].includes(name)) {
        isValid = false;
    }
    return isValid;
};

const PageFinal = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [distance, setDistance] = useState(0);
    const cityData: FormDataType = storage.rcGetItem(
        StorageType.local,
        Storage_Key.city_data,
    );
    useEffect(() => {
        setTimeout(() => {
            const dis = calcDistance(
                cityData.origin_city[0],
                cityData.intermediate_cities,
                cityData.destination_city[0],
            );
            const isValid = valid(cityData);
            setIsError(!isValid);
            setDistance(dis);
            setIsLoading(false);
        }, 3000);
    }, []);
    return (
        <>
            {isLoading && <Loading />}
            <div className="final-page">
                {isError ? (
                    <h1 className="error">Error: Invalid Data</h1>
                ) : (
                    <h1 className="success">Distance: {distance}km</h1>
                )}
                <div className="form-item">
                    <label>City of origin:</label>
                    <Dropdown
                        items={City_Data}
                        name="origin_city"
                        placeholder="Please choose city"
                        mulitiple={false}
                        defaultVal={cityData.origin_city}
                        disabled
                    />
                </div>
                <div className="form-item">
                    <label>Intermediate cities:</label>
                    <Dropdown
                        items={City_Data}
                        name="intermediate_cities"
                        placeholder="Please choose city"
                        mulitiple={true}
                        defaultVal={cityData.intermediate_cities}
                        disabled
                    />
                </div>
                <div className="form-item">
                    <label>City of desitination:</label>
                    <Dropdown
                        items={City_Data}
                        name="destination_city"
                        placeholder="Please choose city"
                        mulitiple={false}
                        defaultVal={cityData.destination_city}
                        disabled
                    />
                </div>
                <div className="form-item">
                    <label>Date of the trip:</label>
                    <Input
                        type="date"
                        name="date_trip"
                        defaultVal={cityData.date_trip}
                        disabled
                    />
                </div>
                <div className="form-item">
                    <label>Number of passengers:</label>
                    <Input
                        type="number"
                        name="num_passenger"
                        placeholder="Please type number of passengers"
                        disabled
                        defaultVal={cityData.num_passenger}
                    />
                </div>
            </div>
        </>
    );
};

export default PageFinal;
