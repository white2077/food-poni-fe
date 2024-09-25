import React from "react";

class SelectedItemLabel extends React.Component<{ label: any }> {
    render() {
        let {label} = this.props;
        return <div className="text-xl font-sans">{label}</div>;
    }
}

export default SelectedItemLabel;