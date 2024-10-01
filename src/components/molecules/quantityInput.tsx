import {Button, Input} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {updateDecreaseQuantityRequest, updateIncreaseQuantityRequest} from "@/redux/modules/cart.ts";
import {RootState} from "@/redux/store.ts";

type Props = {
    readonly item: {
        readonly quantity: number;
        readonly productName: string;
        readonly productDetail: {
            readonly id: string;
            readonly name: string;
            readonly price: number;
            readonly images: string[];
        }
        readonly checked: boolean;
    };
}

export function QuantityInput({item}: Props) {
    const dispatch = useDispatch();

    const {isUpdateLoading} = useSelector((state: RootState) => state.cart);

    return (
        <div className="flex items-center border-[1px] w-24 justify-between rounded-lg">
            <Button type="text"
                    icon={<MinusOutlined/>}
                    loading={isUpdateLoading}
                    disabled={item.quantity <= 1}
                    onClick={() => dispatch(updateDecreaseQuantityRequest(item.productDetail.id))}/>
            <Input
                className="w-8 p-1 text-center"
                defaultValue={1}
                value={item.quantity}
                min={1}
                disabled={isUpdateLoading}
            />
            <Button type="text"
                    icon={<PlusOutlined/>}
                    loading={isUpdateLoading}
                    onClick={() => dispatch(updateIncreaseQuantityRequest(item.productDetail.id))}/>
        </div>
    );
}