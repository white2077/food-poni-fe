import {ParsedUrlQuery} from "querystring";
import {getProductsCardPageByCategory} from "../../queries/product.query";
import {Page} from "../../models/Page";
import {IProductCard} from "../../components/product-rows";

export async function getServerSideProps(context: { params: ParsedUrlQuery }) {
    const {cid} = context.params;

    if (typeof cid !== 'string') {
        throw new Error('invalid cid');
    }

    try {
        const ePage: Page<IProductCard[]> = await getProductsCardPageByCategory(cid, {
            page: 0,
            pageSize: 100,
            status: true
        });
        return {props: {ePage}};
    } catch (e) {
        throw e;
    }
}

interface ProductsCategoryProps {
    ePage: Page<IProductCard[]>
}

export default function ProductsCategory({ePage}: ProductsCategoryProps) {
    return (
        <div>
            {ePage.content.map((product: IProductCard) => (
                <div>{product.name}</div>
            ))}
        </div>
    );
}