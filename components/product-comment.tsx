import React, {useState} from 'react';
import {CheckCircleFilled, CheckOutlined, CommentOutlined, LikeOutlined, ShareAltOutlined,} from '@ant-design/icons';
import {Avatar, Button, Card, Image, List, Progress, Rate, Space} from 'antd';
import {server} from "../utils/server";
import {RateAPIResponse} from "../models/rate/RateAPIResponse";
import Link from "next/link";
import EmptyNotice from "./empty-notice";
import Tym from "./tym";
import Like from "./like";
import Start from "./start";

interface ExpandedComments {
    [key: number]: boolean;
}

const IconText = ({icon, text}: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const getReviewText = ({rate}: { rate: any }) => {
    switch (rate) {
        case 5:
            return 'Cực kì hài lòng';
        case 4:
            return 'Hài lòng';
        case 3:
            return 'Bình thường';
        case 2:
            return 'Không hài lòng';
        case 1:
            return 'Rất không hài lòng';
        default:
            return '';
    }
};

const ProductComment = ({data, isLoading}: { data: RateAPIResponse[], isLoading: boolean }) => {
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleRatingChange = (value: number) => {
        setSelectedRating(value);
        setIsButtonClicked(true);
    };

    const handleShowAllComments = () => {
        setSelectedRating(null);
        setIsButtonClicked(true);
    };


    const [expandedComments, setExpandedComments] = useState<ExpandedComments>({});

    const toggleExpand = (index: number) => {
        setExpandedComments({
            ...expandedComments,
            [index]: !expandedComments[index]
        });
    };
    return (
        <Card size='small'>
            <div className="text-xl font-medium">Khách hàng đánh giá</div>
            <div className="my-2 text-base font-medium">Tổng quan</div>
            <div>
                <div className="flex gap-2 text-4xl items-center">
                    <div>4.7</div>
                    <div><Rate style={{fontSize: '30px'}} disabled value={4}/></div>
                </div>
            </div>
            <div className="my-2 text-gray-400">(900 đánh giá)</div>
            <div className="text-gray-400">
                <div className="flex gap-1"><Rate disabled value={5}/><Progress style={{maxWidth: '13%'}} percent={80}
                                                                                showInfo={false}/>
                    <div>90</div>
                </div>
                <div className="flex gap-1"><Rate disabled value={4}/><Progress style={{maxWidth: '13%'}} percent={70}
                                                                                showInfo={false}/>
                    <div>80</div>
                </div>
                <div className="flex gap-1"><Rate disabled value={3}/><Progress style={{maxWidth: '13%'}} percent={60}
                                                                                showInfo={false}/>
                    <div>70</div>
                </div>
                <div className="flex gap-1"><Rate disabled value={2}/><Progress style={{maxWidth: '13%'}} percent={50}
                                                                                showInfo={false}/>
                    <div>60</div>
                </div>
                <div className="flex gap-1"><Rate disabled value={1}/><Progress style={{maxWidth: '13%'}} percent={10}
                                                                                showInfo={false}/>
                    <div>50</div>
                </div>
            </div>

            <hr className="my-6 "/>
            <div className="my-2 text-base font-medium">Lọc theo</div>
            <div className="flex gap-4 items-center text-gray-500 ">
                <Button style={{borderRadius: '100px'}}>
                    Mới nhất
                </Button>
                <Button style={{borderRadius: '100px'}}>
                    Đã mua hàng
                </Button>
                <Button style={{borderRadius: '100px'}} onClick={() => handleRatingChange(1)}>
                    {selectedRating === 1 && isButtonClicked && <CheckOutlined/>} 1 Sao
                </Button>
                <Button style={{borderRadius: '100px'}} onClick={() => handleRatingChange(2)}>
                    {selectedRating === 2 && isButtonClicked && <CheckOutlined/>} 2 Sao
                </Button>
                <Button style={{borderRadius: '100px'}} onClick={() => handleRatingChange(3)}>
                    {selectedRating === 3 && isButtonClicked && <CheckOutlined/>} 3 Sao
                </Button>
                <Button style={{borderRadius: '100px'}} onClick={() => handleRatingChange(4)}>
                    {selectedRating === 4 && isButtonClicked && <CheckOutlined/>} 4 Sao
                </Button>
                <Button style={{borderRadius: '100px'}} onClick={() => handleRatingChange(5)}>
                    {selectedRating === 5 && isButtonClicked && <CheckOutlined/>} 5 Sao
                </Button>
                <Button style={{backgroundColor: 'orange', color: 'white', borderRadius: '100px'}}
                        onClick={handleShowAllComments}>
                    Tất cả
                </Button>
            </div>
            <hr className="my-6 "/>
            <List
                loading={isLoading}
                itemLayout="vertical"
                size="large"
                locale={{
                    emptyText:
                        <EmptyNotice w="32" h="32" src="/Star.png" message="Chưa có đánh giá nào"/>
                }}
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={selectedRating !== null ? data.filter(item => item.rate === selectedRating) : data}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <div className="grid grid-cols-10 gap-4">
                            <div className="col-span-2">
                                <div className="flex gap-2">
                                    <div>
                                        {<Avatar src={server + item.avatar} className="w-10 h-10"/>}
                                    </div>
                                    <div>
                                        <div>{<Link href={item.username}><span
                                            className="text-black-800 font-sans text-base">{item.username}</span></Link>}</div>
                                        <div className="text-xs font-sans text-gray-400">Đã tham gia 1 triệu năm</div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs font-sans text-gray-400 mt-2">
                                    <div className="gap-2 flex">
                                        <CommentOutlined></CommentOutlined>
                                        <div> Đã viết</div>
                                    </div>
                                    <div>
                                        <span>1 đánh giá</span>
                                    </div>
                                </div>
                                <hr className="my-2 "/>
                                <div className="flex justify-between text-xs font-sans text-gray-400 gap">
                                    <div className="gap-2 flex">
                                        <LikeOutlined></LikeOutlined>
                                        <div>Đã nhận</div>
                                    </div>
                                    <div>
                                        <span>10 lượt cảm ơn</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-8">
                                <div>
                                    <div className="font-medium text-base gap-2 flex"><Rate allowHalf disabled
                                                                                            value={item.rate}/>{getReviewText({rate: item.rate})}
                                    </div>
                                    <div className="text-green-500 gap-1 flex"><CheckCircleFilled/>Đã nhận hàng</div>
                                    <div className="flex gap-2">
                                        <div
                                            className={`text-sm font-normal my-3 ${expandedComments[index] ? 'w-auto' : 'max-w-24 truncate'}`}>
                                            {item.message}
                                        </div>
                                        <button onClick={() => toggleExpand(index)} className="text-orange-400">
                                            {expandedComments[index] ? 'rút gọn' : 'xem thêm'}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap">
                                        {item.images && item.images.map((url, index) => (
                                            <div key={index} className="mr-[10px] mb-[10px]">
                                                <Image src={url} alt={`Image ${index}`} width={70} height={70}
                                                       className="object-cover cursor-pointer rounded-lg"/>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex text-sm text-gray-400 justify-between">
                                        <div className="flex gap-3">
                                            <div className="flex gap-1 items-center">
                                               <div> <Start/></div>
                                                <span>5</span>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <Like/>
                                                <span>10</span>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                {/*<MessageOutlined className="hover:text-orange-400"/>*/}
                                               <div> <Tym/></div>
                                                <span>12</span>
                                            </div>
                                        </div>
                                        <ShareAltOutlined/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default ProductComment