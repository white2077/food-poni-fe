import {Button, Input} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {
    updateDecreaseQuantityRequest,
    updateIncreaseQuantityRequest,
    updateQuantityRequest
} from "@/redux/modules/cart.ts";
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
        readonly isUpdateLoading: boolean;
        readonly isDeleteLoading: boolean;
    }
}

export function QuantityInput({item}: Props) {
    const dispatch = useDispatch();

    const {isUpdateLoading} = useSelector((state: RootState) => {
        const cartItem = state.cart.page.content.find(cart => cart.productDetail.id === item.productDetail.id);
        return { isUpdateLoading: cartItem ? cartItem.isUpdateLoading : false };
    });

    return (
        <div className="flex items-center border-[1px] w-24 justify-between rounded-lg">
            <Button type="text"
                    icon={<MinusOutlined/>}
                    loading={isUpdateLoading}
                    disabled={item.quantity <= 1}
                    onClick={() => dispatch(updateDecreaseQuantityRequest({pdid: item.productDetail.id}))}/>
            <Input
                className="w-8 p-1 text-center"
                min={1}
                defaultValue={1}
                value={item.quantity}
                onChange={(e) => {
                    const inputValue = parseInt(e.target.value);
                    if (!isNaN(inputValue) && inputValue >= 1) {
                        dispatch(updateQuantityRequest({pdid: item.productDetail.id, quantity: inputValue}));
                    }
                }}
                disabled={false}
            />
            <Button type="text"
                    icon={<PlusOutlined/>}
                    loading={isUpdateLoading}
                    onClick={() => dispatch(updateIncreaseQuantityRequest({pdid: item.productDetail.id}))}/>
        </div>
    );
}