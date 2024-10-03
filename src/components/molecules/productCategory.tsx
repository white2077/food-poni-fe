import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {useNavigate} from "react-router-dom";
import {RootState} from "@/redux/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {server} from "@/utils/server.ts";
import {useEffect} from "react";
import {fetchProductCategoriesRequest} from "@/redux/modules/productCategory.ts";

export default function ProductCategory() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {page} = useSelector((state: RootState) => state.productCategory);

    useEffect(() => {
        dispatch(fetchProductCategoriesRequest());
    }, [dispatch]);

    const onClick: MenuProps['onClick'] = (e): void => {
        navigate(`/danh-muc/${e.key}`);
    };

    return (
        <div className="bg-white rounded-lg">
            <div className="p-4">Danh mục</div>
            <Menu
                onClick={onClick}
                className="rounded-lg !border-none"
                defaultSelectedKeys={['all']}
                mode='inline'
                items={page.content.map((it, index) => {
                    return {
                        key: index,
                        label: <span className="flex items-center">
                            <img src={server + it.thumbnail} className="w-4 h-4 mr-2"/>
                            <span className={`${it.parentProductCategory === null ? "font-bold uppercase" : ""}`}>
                                {it.name}
                            </span>
                        </span>
                    }

                })}
            />
        </div>
    );
}