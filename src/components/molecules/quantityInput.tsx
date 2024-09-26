import {Button} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch} from "react-redux";
import {Cart} from "@/type/types.ts";
import {decreaseQuantity, increaseQuantity} from "@/redux/modules/cart.ts";

export function QuantityInput({item}: {item: Cart}) {
    const dispatch = useDispatch();
    // let {item, onChangeQuantity} = this.props;
    // const handleDecrease = () => {
    //     const newQuantity = item.quantity > 1 ? item.quantity - 1 : item.quantity;
    //     onChangeQuantity(item.id, item.retailer?.id ?? '', newQuantity);
    // };
    //
    // const handleIncrease = () => {
    //     const newQuantity = item.quantity + 1;
    //     onChangeQuantity(item.id, item.retailer?.id ?? '', newQuantity);
    // };

    return (
        <div className="flex items-center border-[1px] w-24 justify-between rounded-lg">
            <Button type="text" icon={<MinusOutlined/>} onClick={() => dispatch(decreaseQuantity({id: item.id}))}/>
            <input
                className="w-6 text-center"
                defaultValue={1}
                value={item.quantity}
                // onChange={(e) => {
                //     const value = parseInt(e.target.value);
                //     const newQuantity = !isNaN(value) && value >= 1 ? value : item.quantity;
                //     // onChangeQuantity(item.id, item.retailer?.id ?? '', newQuantity);
                // }}
            />
            <Button type="text" icon={<PlusOutlined/>} onClick={() => dispatch(increaseQuantity({id: item.id}))}/>
        </div>
    );
}