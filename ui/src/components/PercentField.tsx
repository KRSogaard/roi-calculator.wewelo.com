import { useState, useEffect } from 'react';
import SettingsInputField from './SettingsInputField';

interface props {
    name: string;
    label: string;
    value: number;
    onChanged: any;
}

function PercentField(props: props) {
    let { value, onChanged, name, label } = props;

    let [innerValue, setInnerValue] = useState<string>(value * 100 + '');

    useEffect(() => {
        let newValue = value * 100 + '';
        if (newValue !== innerValue) {
            setInnerValue(newValue);
        }
    }, [value]);

    const setFieldValue = (value: any) => {
        setInnerValue(value);
        onChanged(value / 100);
    };

    return (
        <SettingsInputField
            fieldValue={innerValue}
            onChange={setFieldValue}
            fieldName={name}
            fieldLable={label}
            surfix="%"
            rules={{
                min: 0,
                max: 100,
            }}
        />
    );
}

export default PercentField;
