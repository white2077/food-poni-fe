import {
  HomeFilled,
  SettingFilled,
  UserOutlined,
  WalletFilled,
} from "@ant-design/icons";

import HeaderBar from "@/components/molecules/HeaderBar";
import Footer from "@/components/organisms/Footer";
import HeaderMain from "@/components/organisms/HeaderMain";
import { ReactNode } from "react";

export const SidebarLayout = ({
  sidebarContents,
  children,
}: {
  sidebarContents: ReactNode[];
  children: ReactNode;
}) => (
  <div>
    <HeaderBar />
    <HeaderMain />
    <div className="bg-[#F5F5FA]">
      <div className="px-2 max-w-screen-xl mx-auto py-4">
        <div className="flex gap-4">
          <div className="hidden md:flex flex-col gap-4 w-[260px] shrink-0">
            {sidebarContents.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
    <div className="text-center">
      <div className="fixed z-50 w-full h-12 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-lg bottom-4 left-1/2 md:hidden">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
          <button
            data-tooltip-target="tooltip-home"
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 rounded-s-lg hover:bg-gray-50 group"
          >
            <HomeFilled className="text-lg text-gray-700" />
            <span className="sr-only">Home</span>
          </button>
          <div
            id="tooltip-home"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
          >
            Home
            <div className="tooltip-arrow"></div>
          </div>
          <button
            data-tooltip-target="tooltip-wallet"
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <WalletFilled className="text-lg text-gray-700" />
            <span className="sr-only">Wallet</span>
          </button>
          <div
            id="tooltip-wallet"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
          >
            Wallet
            <div className="tooltip-arrow"></div>
          </div>
          <div className="flex items-center justify-center">
            <button
              data-tooltip-target="tooltip-new"
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 font-medium bg-primary rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none"
            >
              FP
              <span className="sr-only">FB</span>
            </button>
          </div>
          <div
            id="tooltip-new"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
          >
            Create new item
            <div className="tooltip-arrow"></div>
          </div>
          <button
            data-tooltip-target="tooltip-settings"
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <SettingFilled className="text-lg text-gray-700" />
            <span className="sr-only">Settings</span>
          </button>
          <div
            id="tooltip-settings"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
          >
            Settings
            <div className="tooltip-arrow"></div>
          </div>
          <button
            data-tooltip-target="tooltip-profile"
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 group"
          >
            <UserOutlined className="text-lg text-gray-700" />
            <span className="sr-only">Profile</span>
          </button>
          <div
            id="tooltip-profile"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
          >
            Profile
            <div className="tooltip-arrow"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
);
