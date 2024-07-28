import React, {useState} from 'react';
import {
    CheckCircleFilled,
    CommentOutlined,
    LikeOutlined,
    MessageOutlined, ShareAltOutlined,
    StarOutlined,
} from '@ant-design/icons';
import {Avatar, Button, Card, Divider, Image, List, notification, Rate, Slider, Space} from 'antd';
import {server} from "../utils/server";
import {RateAPIResponse} from "../models/rate/RateAPIResponse";
import Link from "next/link";
import {Progress} from "antd";

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

    const [showAllComments, setShowAllComments] = useState<boolean>(false);
    const handleRatingChange = (value: number) => {
        setSelectedRating(value);
    };

    const handleShowAllComments = () => {
        setSelectedRating(null); // Reset trạng thái lọc
        setShowAllComments(true);
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
                    <div><Rate style={{fontSize: '30px'}} value={4}/></div>
                </div>
            </div>
            <div className="my-2 text-gray-400">(900 đánh giá)</div>
            <div className="text-gray-400">
                <div className="flex gap-2 "><Rate disabled value={5}/><Progress style={{maxWidth: '20%'}} percent={80}
                                                                                 showInfo={false}/>
                    <div>90</div>
                </div>
                <div className="flex gap-2 "><Rate disabled value={4}/><Progress style={{maxWidth: '20%'}} percent={70}
                                                                                 showInfo={false}/>
                    <div>80</div>
                </div>
                <div className="flex gap-2 "><Rate disabled value={3}/><Progress style={{maxWidth: '20%'}} percent={60}
                                                                                 showInfo={false}/>
                    <div>70</div>
                </div>
                <div className="flex gap-2 "><Rate disabled value={2}/><Progress style={{maxWidth: '20%'}} percent={50}
                                                                                 showInfo={false}/>
                    <div>60</div>
                </div>
                <div className="flex gap-2 "><Rate disabled value={1}/><Progress style={{maxWidth: '20%'}} percent={10}
                                                                                 showInfo={false}/>
                    <div>50</div>
                </div>
            </div>

            <hr className="my-6 "/>
            <div className="my-2 text-base font-medium">Lọc Đánh giá</div>
            <div className="flex gap-4 items-center text-gray-500 ">
                <Rate style={{fontSize: '20px'}} onChange={handleRatingChange}/>
                <Button style={{backgroundColor: 'orange', color: 'white'}} onClick={handleShowAllComments}>Tất
                    cả</Button>
            </div>
            <hr className="my-6 "/>
            <List
                loading={isLoading}
                itemLayout="vertical"
                size="large"
                locale={{
                    emptyText: <div className="w-full h-auto object-cover flex justify-center">
                        <div>
                            <div className="flex justify-center"><img className=" w-32 h-32 object-cover"
                                                                      src={"/img.png"}/></div>
                            <div className="text-2xl text-gray-500 font-medium">Chưa có đánh giá nào ~ ~</div>
                        </div>
                    </div>
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
                                            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o"/>
                                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o"/>
                                            <IconText icon={MessageOutlined} text="2" key="list-vertical-message"/>
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