interface props {
    value: number;
    suffix?: string;
    prefix?: string;
    style?: any;
}

function Currency(props: props) {
    let { value, prefix, suffix } = props;
    let innerStyle = { ...props.style };
    return (
        <span style={innerStyle}>
            {prefix ? prefix : ''}
            {value.toLocaleString()}
            {suffix ? suffix : ''}
        </span>
    );
}

export default Currency;
