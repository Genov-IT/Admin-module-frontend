import React, {useEffect, useState} from 'react';
import {Skeleton} from 'antd';
import {GoogleMap, Marker, DirectionsRenderer, useJsApiLoader} from '@react-google-maps/api';
import {connect} from 'react-redux';

const center = {lat: 7.8731, lng: 80.7718}; // Default center

function MainMapComponent({lat, lng, onMapDataChange, isDarkMode}) {
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyCAZN9g0HMUTErK48yU0Qe4cWDIofG2wM8',
        libraries: ['places'],
    });

    const [zoom, setZoom] = useState(8);
    const [map, setMap] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);

    // Effect to center the map when lat or lng props change
    useEffect(() => {
        console.log("lat",lat,lng);
        if (map && lat && lng) {
            const newCenter = {lat, lng};
            map.panTo(newCenter); // Pan to the new center
            setZoom(15);
        }
    }, [lat, lng, map]);

    if (!isLoaded) {
        return <Skeleton active/>;
    }

    return (
        console.log("lat",lat,lng),
        <GoogleMap
            center={center}
            zoom={zoom}
            mapContainerStyle={{width: '100%', height: '100%'}}
            options={{
                zoomControl: true,
                streetViewControl: true,
                mapTypeControl: true,
                fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
        >
            {lat && lng && <Marker position={{lat, lng}} />} {/* Add a marker at the new position */}
            {directionsResponse && <DirectionsRenderer directions={directionsResponse}/>}
        </GoogleMap>
    );
}

// Map Redux state to component props
const mapStateToProps = (state) => ({
    isDarkMode: state.darkMode.darkMode,
});

// Connect component to Redux store
export default connect(mapStateToProps)(MainMapComponent);
