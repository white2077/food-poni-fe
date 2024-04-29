import React from 'react';
import {Layout} from 'antd';
import MainHeader from "./header";

const {Header, Footer, Sider, Content} = Layout;
export const DefaultLayout = ({children}: { children: React.ReactNode }) => {

    return (
        <div className='bg-[#F5F5FA]'>
            <div className='bg-white'>
                <MainHeader/>
            </div>
            <div className='bg-[#F5F5FA] px-10 w-[1440px] mx-auto my-4'>{children}</div>
            <div className='text-center text-white bg-[#4096ff]'>Footer</div>
        </div>
    );

};
