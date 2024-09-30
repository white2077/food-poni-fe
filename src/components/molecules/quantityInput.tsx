import {Button, Input} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch} from "react-redux";
import {Cart} from "@/type/types.ts";
import {updateDecreaseQuantityRequest, updateIncreaseQuantityRequest} from "@/redux/modules/cart.ts";

type Props = {
    readonly item: Cart;
}

export function QuantityInput({item}: Props) {
    const dispatch = useDispatch();

    return (
        <div className="flex items-center border-[1px] w-24 justify-between rounded-lg">
            <Button type="text"
                    icon={<MinusOutlined/>}
                    loading={item.isUpdateLoading}
                    disabled={item.quantity <= 1}
                    onClick={() => dispatch(updateDecreaseQuantityRequest(item.id))}/>
            <Input
                className="w-8 p-1 text-center"
                defaultValue={1}
                value={item.quantity}
                min={1}
                disabled={item.isUpdateLoading}
            />
            <Button type="text"
                    icon={<PlusOutlined/>}
                    loading={item.isUpdateLoading}
                    onClick={() => dispatch(updateIncreaseQuantityRequest(item.id))}/>
        </div>
    );
}