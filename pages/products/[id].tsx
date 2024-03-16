import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {WithTwoSiderLayout} from "../../components/layout";

const ProductDetail: NextPage = () => {
    const router = useRouter();
    const {id} = router.query;

    console.log(id);

    return (
        // <div>
        //     Detail {id}
        // </div>
        <WithTwoSiderLayout>
            <div style={{color: 'black'}}>Detail {id}</div>
        </WithTwoSiderLayout>
    );
}

export default ProductDetail
