import React from "react";
import {Carousel} from 'antd';


const BannerHotSale = () => {
    return (
        <div className="flex items-center gap-10 w-full justify-center my-5">
            <div>
                <div
                    className="w-40 h-40 cursor-pointer border-4 border-orange-500 flex items-center justify-center rounded-full bg-orange-400 hover:bg-orange-500">
                    <img src="/hot-2.png" className="object-cover hover:w-36 w-28"/>
                </div>
                <span className="flex justify-center nunito text-2xl">Đồ ăn vặt</span>
            </div>
            <div>
                <div
                    className="w-40 h-40 cursor-pointer border-4 border-orange-500 flex items-center justify-center bg-orange-400 hover:bg-orange-500 rounded-full">
                    <img src="/hot-1.png " className="object-cover hover:w-72 w-32"/>
                </div>
                <span className="flex justify-center nunito text-2xl">Lẩu</span>
            </div>
            <div>
                <div
                    className="w-40 h-40 cursor-pointer border-4 border-orange-500 flex items-center justify-center rounded-full bg-orange-400 hover:bg-orange-500">
                    <img src="/hot-3.png" className="object-cover hover:w-28 w-24"/>
                </div>
                <span className="flex justify-center nunito text-2xl">Trà sữa</span>
            </div>
            <div>
                <div
                    className="w-40 h-40 cursor-pointer border-4 border-orange-500 flex items-center justify-center bg-orange-400 hover:bg-orange-500 rounded-full">
                    <img src="/hot-1.png " className="object-cover hover:w-60  w-32"/>
                </div>
                <span className="flex justify-center nunito text-2xl">Đồ chay</span>
            </div>
            <div>
                <div
                    className="w-40 h-40 cursor-pointer border-4 border-orange-500 flex items-center justify-center bg-orange-400 hover:bg-orange-500 rounded-full">
                    <img src="/hot-1.png " className="object-cover hover:w-60  w-32"/>
                </div>
                <span className="flex justify-center nunito text-2xl">Cơm</span>
            </div>
            <div>
                <div
                    className="w-40 h-40 cursor-pointer border-4 border-orange-500 flex items-center justify-center bg-orange-400 hover:bg-orange-500 rounded-full">
                    <img src="/hot-1.png " className="object-cover hover:w-60  w-32"/>
                </div>
                <span className="flex justify-center nunito text-2xl">Phở</span>
            </div>
        </div>
    );
};

export default BannerHotSale;