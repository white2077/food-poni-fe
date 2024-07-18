import { Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {Component} from "react";

class QuantityInput extends Component<{ item: any, onChangeQuantity: any }> {
    render() {
        let {item, onChangeQuantity} = this.props;
        return (
            <div className="flex items-center border-[1px] w-24 justify-between rounded-lg mt-6">
                <Button
                    type="text"
                    icon={<MinusOutlined/>}
                    onClick={() => onChangeQuantity(item.id, item.retailer.id ?? '', item.quantity > 1 ? item.quantity - 1 : item.quantity)}
                />
                <input
                    className="w-6 text-center"
                    defaultValue={1}
                    value={item.quantity}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        onChangeQuantity(item.id, item.retailer.id ?? '', !isNaN(value) && value >= 1 ? value : item.quantity);
                    }}
                />
                <Button
                    type="text"
                    icon={<PlusOutlined/>}
                    onClick={() => onChangeQuantity(item.id, item.retailer.id ?? '', item.quantity + 1)}
                />
            </div>
        );
    }
}

export default QuantityInput;