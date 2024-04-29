import Search from "antd/lib/input/Search";
import {NextRouter, useRouter} from "next/router";

const SearchComponent = () => {

    const router: NextRouter = useRouter();

    const search = (value: string): void => {
        router.push('/products?search=' + value);
        console.log('search')
    };

    return (
        <Search className='hidden md:block' placeholder="input search text"
                enterButton="Search"
                size="large"
                loading={false}
                onSearch={search}
        />
    );

};

export default SearchComponent;