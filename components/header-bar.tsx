import React from "react";
import {Alert} from 'antd';
import Marquee from 'react-fast-marquee';

const HeaderBar = () => {

    return (
        <Alert
            className="lg:w-[1440px] mx-auto text-center bg-primary"
            showIcon={false}
            banner
            message={
                <Marquee pauseOnHover gradient={false} className="text-white text-sm">
                    Happy Valentine's SPRAY! Save an EXTRA 14% off with code #FOODPONI
                </Marquee>
            }
        />
    );

};

export default HeaderBar;