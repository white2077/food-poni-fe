import React from "react";
import Marquee from 'react-fast-marquee';

const HeaderBar = () => {

    return (
        <div
            className="text-center bg-primary py-2 px-0 w-full">
            <Marquee pauseOnHover gradient={false} className="text-white text-sm">
                Happy Valentine's SPRAY! Save an EXTRA 14% off with code #FOODPONI
            </Marquee>
        </div>
    );

};

export default HeaderBar;