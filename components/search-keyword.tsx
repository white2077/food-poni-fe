import {NextRouter, useRouter} from 'next/router';
import {Button, Input, Space} from 'antd';
import React from 'react';

const SearchKeyword = () => {

    const router: NextRouter = useRouter();

    const search = (value: string): void => {
        router.push('/products?search=' + value);
    };

    return (
        <Space.Compact className='w-full hidden md:flex'>
            <Input size='large' placeholder='Bạn tìm gì hôm nay?'/>
            <Button size='large' type='primary' onClick={() => search('') }>Tìm kiếm</Button>
        </Space.Compact>
    );
};

export default SearchKeyword;