import {Button} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import {Component} from 'react';

class CustomInput extends Component<{
    min: any,
    max: any,
    defaultValue: any,
    value: any,
    onChange: any,
    disabled: any
}> {
    render() {
        let {min, max, defaultValue, value, onChange, disabled} = this.props;
        const handleDecrease = () => {
            const newValue = value - 1 >= min ? value - 1 : min;
            onChange(newValue);
        };

        const handleIncrease = () => {
            const newValue = value + 1 <= max ? value + 1 : max;
            onChange(newValue);
        };

        return (
            <div className="flex items-center border-[1px] w-24 justify-between rounded-lg">
                <Button type="text" icon={<MinusOutlined/>} onClick={handleDecrease} disabled={disabled}/>
                <input
                    className="w-6 text-center"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    disabled={disabled}
                />
                <Button type="text" icon={<PlusOutlined/>} onClick={handleIncrease} disabled={disabled}/>
            </div>
        );
    }
}

export default CustomInput;
