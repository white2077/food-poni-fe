import {Button, Input} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch} from "react-redux";
import {Cart} from "@/type/types.ts";
import {updateQuantityRequest} from "@/redux/modules/cart.ts";

type Props = {
    readonly item: Cart;
}

export function QuantityInput({item}: Props) {
    const dispatch = useDispatch();

    return (
        <div className="flex items-center border-[1px] w-24 justify-between rounded-lg">
            <Button type="text" icon={<MinusOutlined/>} loading={item.isUpdateLoading}
                    onClick={() => dispatch(updateQuantityRequest(item.id))}/>
            <Input
                className="w-8 p-1 text-center"
                defaultValue={1}
                value={item.quantity}
                disabled={item.isUpdateLoading}
            />
            <Button type="text" icon={<PlusOutlined/>} loading={item.isUpdateLoading}
                    onClick={() => dispatch(updateQuantityRequest(item.id))}/>
        </div>
    );
}