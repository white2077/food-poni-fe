import React, {useState} from 'react';
import {AimOutlined} from '@ant-design/icons';
import {AutoComplete, Button, Space} from 'antd';
import axios, {AxiosResponse} from "axios";
import {useDispatch} from "react-redux";
import {SearchResult, setSelectedAddress} from "../stores/search-position.reducer";

const SearchPosition = () => {

    const dispatch = useDispatch();

    const [dataSource, setDataSource] = useState<SearchResult[]>([]);

    let timeout: NodeJS.Timeout | null = null;

    const delayedSearch = (value: string): void => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout((): void => {
            axios
                .get<SearchResult[]>(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1`)
                .then((response: AxiosResponse<SearchResult[]>): void => {
                    const results: {
                        display_name: string,
                        lon: number,
                        lat: number
                    }[] = response.data.map((item: SearchResult) => ({
                        display_name: item.display_name,
                        lon: item.lon,
                        lat: item.lat
                    }));

                    setDataSource(results);
                })
                .catch((error): void => {
                    console.error(error);
                });
        }, 500);
    };

    const onSearch = (value: string): void => {
        delayedSearch(value);
    };

    const onSelect = (value: string, option: { data: SearchResult }): void => {
        dispatch(setSelectedAddress(option.data));
    };

    return (
        <div className='absolute w-full md:w-2/3 lg:w-1/2 bottom-1 p-4 z-10'>
            <Space.Compact className='w-full'>
                <AutoComplete
                    className='w-full'
                    placeholder="input your location here..."
                    onSearch={onSearch}
                    options={dataSource.map((result: SearchResult, index: number) => ({
                        value: result.display_name,
                        label: result.display_name,
                        data: result,
                        key: index
                    }))}
                    onSelect={onSelect}
                    size='large'
                />
                <Button size='large' icon={<AimOutlined/>}/>
            </Space.Compact>
        </div>
    );
}

export default SearchPosition;