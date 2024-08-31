import React, { useState } from 'react';
import { AimOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Space } from 'antd';
import axios, { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import { SearchResult, setSelectedAddress } from "../stores/search-position.reducer";

const SearchPosition = () => {

    const dispatch = useDispatch();

    const [dataSource, setDataSource] = useState<SearchResult[]>([]);

    const [pending, setPending] = useState<boolean>(false);

    const [noResult, setNoResult] = useState<boolean>(false);

    let timeout: NodeJS.Timeout | null = null;

    const delayedSearch = (value: string): void => {
        setPending(true);

        axios
            .get<SearchResult[]>(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&countrycodes=vn`)
            .then((response: AxiosResponse<SearchResult[]>): void => {
                const results: SearchResult[] = response.data.map((item: SearchResult) => ({
                    display_name: item.display_name,
                    lon: item.lon,
                    lat: item.lat
                }));

                setDataSource(results);
                setNoResult(results.length === 0);
                setPending(false);
            })
            .catch((error): void => {
                console.error(error);
                setPending(false);
            });
    };

    const onSearch = (value: string): void => {
        if (timeout) {
            clearTimeout(timeout);
        }
        if (value !== '') {
            timeout = setTimeout((): void => {
                delayedSearch(value);
            }, 500);
        } else {
            setDataSource([]);
            setNoResult(false);
        }
    };

    const onSelect = (value: string, option: { data: SearchResult }): void => {
        dispatch(setSelectedAddress(option.data));
    };

    const getCurrentLocation = (): void => {
        if (navigator.geolocation) {
            setPending(true);
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition): void => {
                    const searchResult: SearchResult = {
                        display_name: null,
                        lon: position.coords.longitude,
                        lat: position.coords.latitude
                    };

                    dispatch(setSelectedAddress(searchResult));
                    setPending(false);
                },
                (error: GeolocationPositionError): void => {
                    console.error(error);
                    setPending(false);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const renderOptions = (): React.ReactNodeArray => {
        if (noResult) {
            return [
                <AutoComplete.Option key="no-result" value="Không tìm thấy dữ liệu" disabled>
                    Không tìm thấy dữ liệu
                </AutoComplete.Option>
            ];
        }

        return dataSource.map((result: SearchResult, index: number) => (
            <AutoComplete.Option key={index} value={result.display_name} data={result}>
                {result.display_name}
            </AutoComplete.Option>
        ));
    };

    return (
        <div className='absolute w-full md:w-2/3 lg:w-1/2 bottom-1 p-4 z-10'>
            <Space.Compact className='w-full'>
                <AutoComplete
                    className=' lg:w-full md:w-2/3 '
                    placeholder="Nhập địa chỉ của bạn tại đây..."
                    onSearch={onSearch}
                    onSelect={onSelect}
                    size='large'
                >
                    {renderOptions()}
                </AutoComplete>
                <Button size='large' icon={<AimOutlined />} loading={pending} onClick={getCurrentLocation} />
            </Space.Compact>
        </div>
    );
}

export default SearchPosition;