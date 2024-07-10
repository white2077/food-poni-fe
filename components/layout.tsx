import React from 'react';
import HeaderMain from "./header-main";
import {Alert} from "antd";
import Marquee from 'react-fast-marquee';
import {HomeFilled, SettingFilled, UserOutlined, WalletFilled} from "@ant-design/icons";
import HeaderBar from "./header-bar";

interface SidebarLayoutProps {
    children: React.ReactNode,
    sidebarContents: JSX.Element[]
}

interface DefaultLayoutProps {
    children: React.ReactNode
}

export const SidebarLayout = ({children, sidebarContents}: SidebarLayoutProps) => {

    return (
        <div>
            <HeaderBar/>
            <HeaderMain/>
            <div className='bg-[#F5F5FA]'>
                <div className='px-2 max-w-screen-xl mx-auto py-4'>
                    <div className='flex gap-4'>
                        <div className='hidden md:flex flex-col gap-4'>
                            {sidebarContents.map((item: JSX.Element) => item)}
                        </div>
                        {children}
                    </div>
                </div>
            </div>
            <div className='text-center'>
                <div
                    className="fixed z-50 w-full h-12 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-lg bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600 md:hidden">
                    <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                        <button data-tooltip-target="tooltip-home" type="button"
                                className="inline-flex flex-col items-center justify-center px-5 rounded-s-lg hover:bg-gray-50 dark:hover:bg-gray-800 group">
                            <HomeFilled className="text-lg text-gray-700"/>
                            <span className="sr-only">Home</span>
                        </button>
                        <div id="tooltip-home" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Home
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button data-tooltip-target="tooltip-wallet" type="button"
                                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                            <WalletFilled className="text-lg text-gray-700"/>
                            <span className="sr-only">Wallet</span>
                        </button>
                        <div id="tooltip-wallet" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Wallet
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button data-tooltip-target="tooltip-new" type="button"
                                    className="inline-flex items-center justify-center w-10 h-10 font-medium bg-primary rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                                FP
                                <span className="sr-only">FB</span>
                            </button>
                        </div>
                        <div id="tooltip-new" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Create new item
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button data-tooltip-target="tooltip-settings" type="button"
                                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                            <SettingFilled className="text-lg text-gray-700"/>
                            <span className="sr-only">Settings</span>
                        </button>
                        <div id="tooltip-settings" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Settings
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button data-tooltip-target="tooltip-profile" type="button"
                                className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
                            <UserOutlined className="text-lg text-gray-700"/>
                            <span className="sr-only">Profile</span>
                        </button>
                        <div id="tooltip-profile" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Profile
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                    </div>
                </div>

                <footer className="m-4 dark:bg-gray-800">
                    <div
                        className="w-full mx-auto max-w-screen-xl p-4 shadow rounded-lg md:flex md:items-center md:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a
                        href="/"
                        className="hover:underline">FoodPoni™</a>. All Rights Reserved.
                    </span>
                        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">About</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">Contact</a>
                            </li>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );

};

export const DefaultLayout = ({children}: DefaultLayoutProps) => {

    return (
        <div>
            <HeaderBar/>
            <HeaderMain/>
            <div className='bg-[#F5F5FA]'>
                <div className='px-2 max-w-screen-xl mx-auto py-4'>
                    {children}
                </div>
            </div>
            <div className='text-center'>
                <div
                    className="fixed z-50 w-full h-12 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-lg bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600 md:hidden">
                    <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                        <button data-tooltip-target="tooltip-home" type="button"
                                className="inline-flex flex-col items-center justify-center px-5 rounded-s-lg hover:bg-gray-50 dark:hover:bg-gray-800 group">
                            <HomeFilled className="text-lg text-gray-700"/>
                            <span className="sr-only">Home</span>
                        </button>
                        <div id="tooltip-home" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Home
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button data-tooltip-target="tooltip-wallet" type="button"
                                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                            <WalletFilled className="text-lg text-gray-700"/>
                            <span className="sr-only">Wallet</span>
                        </button>
                        <div id="tooltip-wallet" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Wallet
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button data-tooltip-target="tooltip-new" type="button"
                                    className="inline-flex items-center justify-center w-10 h-10 font-medium bg-primary rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                                FP
                                <span className="sr-only">FB</span>
                            </button>
                        </div>
                        <div id="tooltip-new" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Create new item
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button data-tooltip-target="tooltip-settings" type="button"
                                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                            <SettingFilled className="text-lg text-gray-700"/>
                            <span className="sr-only">Settings</span>
                        </button>
                        <div id="tooltip-settings" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Settings
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button data-tooltip-target="tooltip-profile" type="button"
                                className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
                            <UserOutlined className="text-lg text-gray-700"/>
                            <span className="sr-only">Profile</span>
                        </button>
                        <div id="tooltip-profile" role="tooltip"
                             className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Profile
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                    </div>
                </div>

                <footer className="m-4 dark:bg-gray-800">
                    <div
                        className="w-full mx-auto max-w-screen-xl p-4 shadow rounded-lg md:flex md:items-center md:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a
                        href="/"
                        className="hover:underline">FoodPoni™</a>. All Rights Reserved.
                    </span>
                        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">About</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">Contact</a>
                            </li>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    );

};
