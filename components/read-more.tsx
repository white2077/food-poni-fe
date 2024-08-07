import React, {useEffect, useRef, useState} from 'react';
import {Card} from 'antd';

interface ReadMoreProps {
    content?: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({content}) => {
    const [expanded, setExpanded] = useState(false);
    const [height, setHeight] = useState('500px');
    const [opacity, setOpacity] = useState(0);
    const [buttonText, setButtonText] = useState('Xem thêm');
    const [showButton, setShowButton] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (expanded) {
            const contentHeight = contentRef.current?.scrollHeight;
            setHeight(`${contentHeight}px`);
            setOpacity(1);
        } else {
            setHeight('500px');
            setOpacity(1);
        }
    }, [expanded]);

    useEffect(() => {
        if (contentRef.current && contentRef.current.scrollHeight > 500) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    }, [content]);

    const toggleDescription = () => {
        setExpanded(!expanded);
        setButtonText(expanded ? 'Xem thêm' : 'Ẩn bớt');
    };

    const sanitizedDescription = content || '';

    return (
        <Card size="small" title="Mô tả">
            <div className="description-container bg-center relative">
                <div
                    ref={contentRef}
                    className={`text-black overflow-clip transition-all `}
                    dangerouslySetInnerHTML={{__html: sanitizedDescription}}
                    style={{maxHeight: height, opacity: opacity}}
                ></div>
                {showButton && (
                    <button
                        onClick={toggleDescription}
                        className="absolute text-sm inset-x-0 bottom-[0.01%] text-gray-600 font-sans w-full hover:text-orange-500 bg-gradient-to-t from-white via-white-900 to-transparent size-24">
                        <div className="w-full h-full flex items-end justify-center">{buttonText}</div>
                    </button>
                )}
            </div>
        </Card>
    );
};

export default ReadMore;