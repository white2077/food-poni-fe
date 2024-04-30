import React from 'react';
import {Layout} from 'antd';
import HeaderMain from "./header-main";
import HeaderBar from "./header-bar";

export const DefaultLayout = ({children}: { children: React.ReactNode }) => {

    return (
        <>
            <div className='bg-primary'>
                <HeaderBar/>
            </div>
            <div className='bg-white'>
                <HeaderMain/>
            </div>
            <div className='bg-[#F5F5FA]'>
                <div className='px-2 lg:w-[1440px] mx-auto py-4'>{children}</div>
            </div>
            <div className='text-center text-white bg-primary'>Footer</div>
        </>
    );

};
