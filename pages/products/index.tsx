import {useRouter} from "next/router";
import {DefaultLayout} from "../../components/layout";

const ProductsPage = () => {
    const router = useRouter();
    const {search} = router.query;

    return (
        <DefaultLayout>
            <div>Search: ${search}</div>
        </DefaultLayout>
    )
}

export default ProductsPage