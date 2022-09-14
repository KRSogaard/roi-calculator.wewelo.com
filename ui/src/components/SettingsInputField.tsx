import { IYearResult } from '../Simulator';
import { Controller, Control } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';

interface SettingsInputFieldProps {
    fieldName: string;
    fieldLable: string;
    fieldValue: any;
    setFieldValue: (value: any) => void;
    prefix?: string | undefined;
    surfix?: string | undefined;
    rules: any;
    errors?: string[];
}

function SettingsInputField(props: SettingsInputFieldProps) {
    let inputProps = {} as any;
    if (props.prefix) {
        inputProps.startAdornment = <InputAdornment position="start">{props.prefix}</InputAdornment>;
    }
    if (props.surfix) {
        inputProps.endAdornment = <InputAdornment position="end">{props.surfix}</InputAdornment>;
    }

    const parse = (v: string): number => {
        return parseFloat(v.replace(/,/g, ''));
    };
    const isNumeric = (str: string): boolean => {
        return Number(str.replace(/,/g, '')) !== NaN;
    };
    let onChange = (e: any) => {
        if (!isNumeric(e.target.value)) {
            console.log(e.target.value, 'Is not a number');
            return;
        }

        let rightDot = e.target.value.split('.');
        let addDot = '';
        if (e.target.value.endsWith('.')) {
            addDot = '.';
        } else if (rightDot.length >= 2) {
            addDot = '.' + rightDot[1];
        }
        var commas = parse(e.target.value).toLocaleString('en-US');
        commas = commas.split('.')[0] + addDot;
        props.setFieldValue(commas);
    };

    return (
        <FormControl fullWidth sx={{ m: 1 }}>
            <TextField
                label={props.fieldLable}
                id="outlined-size-small"
                size="small"
                name={props.fieldName}
                value={props.fieldValue}
                onChange={onChange}
                InputProps={inputProps}
            />
        </FormControl>
    );
}

export default SettingsInputField;
