import Search from "antd/lib/input/Search";
import {NextRouter, useRouter} from "next/router";
import {Button, Input, Space} from "antd";
import React from "react";

const SearchComponent = () => {

    const router: NextRouter = useRouter();

    const search = (value: string): void => {
        router.push('/products?search=' + value);
        console.log('search')
    };

    return (
        <Space.Compact className='w-full'>
            <Input defaultValue="input keyword here..." />
            <Button type="primary">Search</Button>
        </Space.Compact>
    );

};

export default SearchComponent;