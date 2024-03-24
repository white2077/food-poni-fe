import Search from "antd/lib/input/Search";
import {useRouter} from "next/router";

const SearchComponent = () => {
    const router = useRouter();
    const search = (value: string) => {
        router.push('/products?search=' + value);
        console.log('search')
    }

    return (
        <Search placeholder="input search text"
                style={{verticalAlign: 'middle'}}
                enterButton="Search"
                size="large"
                loading={false}
                onSearch={search}
        />
    )
}

export default SearchComponent