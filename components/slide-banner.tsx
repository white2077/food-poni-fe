import React from 'react';
import {Carousel} from 'antd';

const contentStyle: React.CSSProperties = {
    height: '140px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    marginTop: '10px',
    background: '#364d79',
    borderRadius: '10px',
};

const Banner: React.FC = () => (
    <div style={{maxWidth: '22rem', margin: 'auto'}}>
        <Carousel arrows infinite autoplay>
            <div>
                <h3 style={contentStyle}>
                    <img className="w-full h-full object-cover rounded-lg" src="/img_1.png" alt="1.png"/>
                </h3>
            </div>
            <div>
                <h3 style={contentStyle}>
                    <img className="w-full h-full object-cover rounded-lg" src="/img_2.png" alt="2.png"/>
                </h3>
            </div>
            <div>
                <h3 style={contentStyle}>
                    <img className="w-full h-full object-cover rounded-lg" src="/img_1.png" alt="3.png"/>
                </h3>
            </div>
            <div>
                <h3 style={contentStyle}>
                    <img className="w-full h-full object-cover rounded-lg" src="/img_2.png" alt="3.png"/>
                </h3>
            </div>
            <div>
                <h3 style={contentStyle}>
                    <img className="w-full h-full object-cover rounded-lg" src="/img_4.png" alt="1.png"/>
                </h3>
            </div>
        </Carousel>
    </div>
);

export default Banner;