import {Button, Input} from 'antd';
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';

export default function CustomInput({min, defaultValue, value, onChange, disabled}: {
    min: number,
    defaultValue: number,
    value: number,
    onChange: (value: number) => void,
    disabled: boolean
}) {

    return (
        <div className="flex items-center border-[1px] w-24 justify-between rounded-lg">
            <Button type="text" icon={<MinusOutlined/>}
                    onClick={() => onChange(value - 1)}
                    disabled={value <= min}/>
            <Input
                className="w-8 p-1 text-center"
                min={min}
                defaultValue={defaultValue}
                value={value}
                onChange={(e) => {
                    const inputValue = parseInt(e.target.value);
                    if (!isNaN(inputValue) && inputValue >= 1) {
                        onChange(inputValue);
                    }
                }}
                disabled={disabled}
            />
            <Button type="text" icon={<PlusOutlined/>}
                    onClick={() => onChange(value + 1)}
                    disabled={disabled}/>
        </div>
    );
}
