import React from "react";

class SelectedItemLabel extends React.Component<{ label: any }> {
    render() {
        let {label} = this.props;
        return <div className="my-2 text-[20px] font-sans">{label}</div>;
    }
}

export default SelectedItemLabel;