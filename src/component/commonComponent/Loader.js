import React, { useState, useEffect } from 'react';
import PropagateLoader from "react-spinners/PropagateLoader";
import AccountCSS from './loader.module.css';
import { themeColors } from '../../theme/variables';
import loader from '../../images/l.gif'

function Loader() {
    const colors = ['#feb900', '#fc7b00', '#dd1e47cf', '#0a69b7', '#30a468']; // Define your colors
    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    useEffect(() => {
        // Start a setInterval to change the color of the loader
        const intervalId = setInterval(changeColor, 700); // Change color every 0.7 seconds

        return () => {
            // Clear the interval when the component unmounts
            clearInterval(intervalId);
        };
    }, []);

    const changeColor = () => {
        // Calculate the next color index, looping back to the beginning if necessary
        setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    };

    const currentColor = colors[currentColorIndex];

    return (
        <div>
            <div className={AccountCSS.loadercontainer}>
                <div style={{ position: 'fixed', left: '50%', top: '40%' }}>
                    <span style={{ color: 'white', zIndex: 1000, fontWeight: 600, fontSize: 15,position:"absolute",marginTop:12,marginLeft:-28 }}>COLORATION</span>
                    <PropagateLoader
                        sizeUnit={"px"}
                        size={45}
                        color={currentColor}
                        loading={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default Loader;
