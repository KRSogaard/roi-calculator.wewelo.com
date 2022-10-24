import React, { useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { isNumeric, formatNumber } from '../utils';

interface SettingsInputFieldProps {
    fieldName: string;
    fieldLable: string;
    fieldValue: any;
    onChange: (value: any) => void;
    prefix?: string | undefined;
    surfix?: string | undefined;
    rules: any;
}

function SettingsInputField(props: SettingsInputFieldProps) {
    let { fieldName, fieldLable, fieldValue, onChange, prefix, surfix, rules } = props;

    let inputProps = {} as any;
    if (prefix) {
        inputProps.startAdornment = <InputAdornment position="start">{prefix}</InputAdornment>;
    }
    if (surfix) {
        inputProps.endAdornment = <InputAdornment position="end">{surfix}</InputAdornment>;
    }

    const [innerValue, setInnerValue] = React.useState<string>(formatNumber(fieldValue + ''));
    const [isMath, setIsMath] = React.useState<boolean>(false);

    useEffect(() => {
        let formatted = formatNumber(fieldValue + '');
        console.log('Outer value changed', fieldValue, formatted, innerValue);
        if (formatted !== innerValue) {
            setInnerValue(formatted);
        }
    }, [fieldValue]);

    useEffect(() => {
        if (!innerValue || innerValue === '') {
            onChange(0);
            return;
        }
        if (innerValue.endsWith('.')) {
            // No change
            return;
        }
        if (isStringMath(innerValue)) {
            // wait for math to finish, also remove commas if any
            if (!isMath) {
                setInnerValue(innerValue.replace(/,/g, ''));
                setIsMath(true);
            }
            return;
        }

        let numStr = cleanNumber(innerValue);
        let num = parseInt(numStr);
        if (isNaN(num)) {
            onChange(0);
            setInnerValue('');
            return;
        }

        if (innerValue.includes('.')) {
            num = parseFloat(numStr);
        }
        if (rules && rules.min && num < rules.min) {
            console.log(innerValue, 'Is less than min');
            setInnerValue(props.rules.min);
            return;
        }
        if (rules && rules.max && num > rules.max) {
            console.log(innerValue, 'Is less than max');
            setInnerValue(props.rules.max);
            return;
        }

        onChange(num);
        let formatted = formatNumber(num + '');
        if (formatted !== innerValue) {
            // Formatting the number for the user;
            setInnerValue(formatted);
        }
    }, [innerValue]);

    const onblur = () => {
        if (!isMath) {
            return;
        }
        let result = 0;
        try {
            result = calculateMath(innerValue);
        } catch (error) {
            console.log('Failed to calculate math: ', error);
        }
        console.log('Result: ', result);
        setIsMath(false);
        setInnerValue(result + '');
    };
    function calculateMath(data: string): number {
        console.log('Calculating: ', data);
        return new Function(` return ${data}`)() as number;
    }

    const isStringMath = (value: string) => {
        return value.includes('+') || value.includes('-') || value.includes('*') || value.includes('/') || value.includes('(') || value.includes(')');
    };

    let cleanNumber = (value: string): string => {
        if (!value) {
            return '0';
        }
        return value.replace(/,/g, '');
    };

    return (
        <FormControl fullWidth sx={{ m: 1 }}>
            <TextField
                label={fieldLable}
                id="outlined-size-small"
                size="small"
                name={fieldName}
                value={innerValue}
                onChange={(e) => setInnerValue(e.target.value)}
                InputProps={inputProps}
                onBlur={() => onblur()}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onblur();
                    }
                }}
            />
        </FormControl>
    );
}

export default SettingsInputField;
