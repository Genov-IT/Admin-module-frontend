import React, { useRef, useState, useEffect } from 'react';
import { Input, Button, Skeleton, Typography, Space, Divider, Row, Col } from 'antd';
import { SearchOutlined, CloseCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from '@react-google-maps/api'
import { connect } from 'react-redux';

const { Text } = Typography;

const center = { lat: 7.8731, lng: 80.7718 };



function MapComponent({ onMapDataChange, isDarkMode }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyCAZN9g0HMUTErK48yU0Qe4cWDIofG2wM8',
        libraries: ['places'],
    });

    const [map, setMap] = useState(/** @type google.maps.Map */(null));
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    const [originData, setOriginData] = useState('');
    const [destinationData, setDestinationData] = useState('');




    const [origin, setOrigin] = useState({
        lat: 6.917008106013807,
        lng: 79.90902024734042,
        address: "Magic Lantern (Pvt) Ltd, Buthgamuwa Road, Sri Jayawardenepura Kotte, Sri Lanka"
    });





    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()

    if (!isLoaded) {
        return <Skeleton active />;
    }

    async function calculateRoute() {
        if (originRef.current.state?.value === '' || destiantionRef.current.state?.value === '') {
            return;
        }

        setDestinationData(originRef.current.value);
        setOriginData(destiantionRef.current.value);

        const directionsService = new window.google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: originRef.current.value,
            destination: destiantionRef.current.value,
            travelMode: window.google.maps.TravelMode.DRIVING,
        });

        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
    }

    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destiantionRef.current.value = ''
        window.location.reload()
    }


    const onClear = () => {
        map.panTo(center);
        map.setZoom(7);
        setDirectionsResponse(null)
    }

    const handleMapInteraction = () => {

        const data = {
            distance: distance,
            duration: duration,
            destinationData: originData,
            originData: destinationData,
        };

        // Call the callback function passed from the parent
        onMapDataChange(data);
    };


    return (

        <><GoogleMap
            center={center}
            zoom={8}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
                zoomControl: true,
                streetViewControl: true,
                mapTypeControl: true,
                fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
        >
            <Marker position={center} />
            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: 10,
                    backgroundColor: isDarkMode ? 'var(--content-container-bg-dark)' : '#fff',
                    borderRadius: 8,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    flexDirection: 'row'
                }}
            >
                <Row align={'middle'}>
                    <Col lg={14}>
                        <Row>
                            <Col lg={8} xs={24}>
                                <Autocomplete options={{ componentRestrictions: { country: 'LK' } }}>
                                    <input
                                        style={{
                                            padding: '10px',
                                            margin: '5px',
                                            fontSize: '15px',
                                            border: '1px solid #ccc',
                                            borderRadius: '5px',
                                            width: '90%', // Adjust the width as needed
                                            height: '10px'
                                        }}
                                        type='text'
                                        placeholder='Origin'
                                        ref={originRef}
                                        defaultValue={origin.address}
                                    />
                                </Autocomplete>
                            </Col>
                            <Col lg={9} xs={24}>
                                <Autocomplete options={{ componentRestrictions: { country: 'LK' } }}>
                                    <input
                                        style={{
                                            padding: '10px',
                                            margin: '5px',
                                            fontSize: '15px',
                                            border: '1px solid #ccc',
                                            borderRadius: '5px',
                                            width: '90%',// Adjust the width as needed
                                            height: '10px'
                                        }}
                                        type='text'
                                        placeholder='Destination'
                                        ref={destiantionRef}
                                    />
                                </Autocomplete>
                            </Col>
                            <Col lg={6} xs={24}>
                                <div style={{ textAlign: 'center', display: 'flex', placeContent: 'space-evenly', float: 'left' }}>
                                    <Button icon={<SearchOutlined />} type="primary" htmlType="submit" className="common-save-btn common-btn-color" onClick={calculateRoute} style={{ marginTop: '5px' }}>
                                        <span style={{ fontWeight: '500' }}>Direction</span>
                                    </Button>
                                    <Button type="default" onClick={clearRoute} style={{
                                        marginTop: '5px',
                                        marginLeft: '5px',
                                        backgroundcolor: isDarkMode ? 'var(--cancel-btn-bg-dark)' : 'var(--cancel-btn-bg-light)',
                                        color: isDarkMode ? 'var( --cancel-btn-color-dark)' : 'var(--cancel-btn-color-light)'

                                    }}>
                                        <span style={{ fontWeight: '600' }}>Reset</span>
                                    </Button>
                                </div>

                            </Col>

                        </Row>



                    </Col>
                    <Col lg={10}>

                        {distance &&
                            <Row>
                                <Col lg={7} xs={24}>
                                    <Text ><span style={{ fontWeight: '500', fontSize: '17px' }}>Distance :</span> <span style={{ fontWeight: '600', fontSize: '15px', marginLeft: '10px' }}>{distance}</span></Text>
                                </Col>

                                <Col lg={9} xs={24}>
                                    <Text><span style={{ fontWeight: '500', fontSize: '17px' }}>Duration :</span> <span style={{ fontWeight: '600', fontSize: '15px', marginLeft: '10px' }}>{duration}</span> </Text>
                                </Col>

                                <Col lg={8} xs={24}>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<ArrowUpOutlined />}
                                        onClick={() => {
                                            handleMapInteraction()
                                        }} />
                                </Col>

                            </Row>
                        }
                    </Col>
                </Row>
            </div>
        </>

    );
}
const mapStateToProps = (state) => ({
    isDarkMode: state.darkMode.darkMode,
});

export default connect(mapStateToProps)(MapComponent);
