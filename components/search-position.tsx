import React from 'react';
import {AimOutlined, UserOutlined} from '@ant-design/icons';
import {AutoComplete, Button, Input, Space} from 'antd';
import {NextPage} from 'next';
import {DefaultOptionType} from "rc-select/es/Select";



const SearchPosition = () =>
{
    const [options, setOptions] = React.useState<DefaultOptionType[]>([]);
    const handleSearch = (value: string) => {
        setOptions(() => {
            if (!value || value.includes('@')) {
                return [];
            }
            return ['gmail.com', '163.com', 'qq.com'].map<DefaultOptionType>((domain) => ({
                label: `${value}@${domain}`,
                value: `${value}@${domain}`,
            }));
        });
    };

    return(
        <Space.Compact className='w-full'>
            <AutoComplete
                style={{ width: 200 }}
                onSearch={handleSearch}
                placeholder="input your location here..."
                options={options}
                size='large'
            />
            <Button size='large' icon={<AimOutlined/>}/>
        </Space.Compact>
    );
}

export default SearchPosition;