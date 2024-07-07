import React from 'react';
import HeaderMain from "./header-main";
import HeaderBar from "./header-bar";

export const DefaultLayout = ({children}: { children: React.ReactNode }) => {

    return (
        <div className="flex flex-col">
            <div className="fixed z-50 left-[var(--sidebar-width)]">

            </div>

            <div className="ml-[--sidebar-width]">
                <div className=""></div>
            </div>
        </div>
    );

};
