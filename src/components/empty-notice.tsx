import React from 'react';

class EmptyNotice extends React.Component<{ w: any, h: any, src: any, message: any }> {
    render() {
        let {w, h, src, message} = this.props;
        return (
            <div className="w-full h-full object-cover flex justify-center">
                <div>
                    <div className="flex justify-center">
                        <img className={`w-${w} h-${h} object-cover`} src={src} alt="No Product"/>
                    </div>
                    <div className="text-2xl text-center text-gray-500 font-medium">{message}</div>
                </div>
            </div>
        );
    }
}

export default EmptyNotice;