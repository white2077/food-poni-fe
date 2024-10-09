import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleFilled, CommentOutlined, LikeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Avatar, Card, Image, List, Progress, Rate } from 'antd';
import { server } from "../utils/server";
import EmptyNotice from "./empty-notice";
import Like from "./like";
import Start from "./start";
import { Link } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { fetchRatesByProductRequest } from '@/redux/modules/rate';
import { ProductDetail } from '@/type/types';
import Tym from './atoms/tym';

interface ExpandedComments {
    [key: number]: boolean;
}

const REVIEW_TEXTS = [
    'Rất không hài lòng',
    'Không hài lòng',
    'Bình thường',
    'Hài lòng',
    'Cực kì hài lòng'
];

const getReviewText = (rate: number) => REVIEW_TEXTS[rate - 1] || '';

interface ProductRateProps {
    productDetailSelected: ProductDetail;
}

export default function ProductRate({ productDetailSelected }: ProductRateProps) {
    const dispatch = useDispatch();
    const { page, isFetchLoading } = useSelector((state: RootState) => state.rate);
    const [expandedComments, setExpandedComments] = useState<ExpandedComments>({});

    useEffect(() => {
        if (productDetailSelected.id) {
            dispatch(fetchRatesByProductRequest({ productId: productDetailSelected.id, queryParams: { page: 0, pageSize: 10 } }));
        }
    }, [dispatch, productDetailSelected.id]);

    const toggleExpand = (index: number) => {
        setExpandedComments(prev => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <Card size='small'>
            <h2 className="text-xl font-medium">Khách hàng đánh giá</h2>
            <h3 className="my-2 text-base font-medium">Tổng quan</h3>
            <div className="flex flex-wrap gap-2 text-4xl items-center">
                <div>{productDetailSelected?.rate?.toFixed(1) || 0}</div>
                <Rate style={{ fontSize: '30px' }} allowHalf disabled value={productDetailSelected?.rate} />
            </div>
            <div className="my-2 text-gray-400">({productDetailSelected.rateCount} đánh giá)</div>
            {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex flex-wrap gap-1 text-gray-400">
                    <Rate disabled value={rating} />
                    <Progress
                        style={{ maxWidth: '100%', width: '13%' }}
                        percent={(page.content.filter(item => item.rate === rating).length / page.content.length) * 100}
                        showInfo={false}
                    />
                    <div>{page.content.filter(item => item.rate === rating).length}</div>
                </div>
            ))}
            <hr className="my-6" />
            <List
                loading={isFetchLoading}
                itemLayout="vertical"
                size="large"
                locale={{
                    emptyText: <EmptyNotice w="72" h="60" src="/no-comment.png" message="Chưa có đánh giá nào" />
                }}
                pagination={{
                    position: 'bottom',
                    align: 'center',
                    onChange: (page) => {
                        dispatch(fetchRatesByProductRequest({ productId: productDetailSelected.id, queryParams: { page: page - 1, pageSize: 10 } }));
                    },
                    pageSize: 10,
                    total: page.totalElements,
                }}
                dataSource={page.content}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex gap-2">
                                    <Avatar src={server + item.avatar} className="w-10 h-10" />
                                    <div>
                                        <Link to={`/user/${item.username}`}>
                                            <span className="text-black-800 font-sans text-base">{item.username}</span>
                                        </Link>
                                        <div className="text-xs font-sans text-gray-400">Đã tham gia {item.name}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs font-sans text-gray-400 mt-2">
                                    <div className="gap-2 flex">
                                        <CommentOutlined />
                                        <div>Đã viết</div>
                                    </div>
                                    <div>1 đánh giá</div>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-xs font-sans text-gray-400">
                                    <div className="gap-2 flex">
                                        <LikeOutlined />
                                        <div>Đã nhận</div>
                                    </div>
                                    <div>10 lượt cảm ơn</div>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-8">
                                <div className="font-medium text-base gap-2 flex flex-wrap">
                                    <Rate allowHalf disabled value={item.rate} />
                                    {getReviewText(item.rate)}
                                </div>
                                <div className="text-green-500 gap-1 flex">
                                    <CheckCircleFilled />Đã nhận hàng
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div
                                        className={`text-sm font-normal my-3 ${expandedComments[index] ? 'w-auto' : 'max-w-24 truncate'}`}>
                                        {item.message}
                                    </div>
                                    <button onClick={() => toggleExpand(index)} className="text-orange-400">
                                        {expandedComments[index] ? 'rút gọn' : 'xem thêm'}
                                    </button>
                                </div>
                                <div className="flex flex-wrap">
                                    {item.images?.map((url, imgIndex) => (
                                        <div key={imgIndex} className="mr-[10px] mb-[10px]">
                                            <Image src={url} alt={`Image ${imgIndex}`} width={70} height={70}
                                                className="object-cover cursor-pointer rounded-lg" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap text-sm text-gray-400 justify-between">
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex gap-1 items-center">
                                            <Start />
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <Like />
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <Tym />
                                            <span>{item.name}</span>
                                        </div>
                                    </div>
                                    <ShareAltOutlined />
                                </div>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
}