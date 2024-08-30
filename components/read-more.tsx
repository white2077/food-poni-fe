import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'antd';

interface ReadMoreProps {
    content?: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({ content }) => {
    const [expanded, setExpanded] = useState(false);
    const [height, setHeight] = useState('500px');
    const [showButton, setShowButton] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current && contentRef.current.scrollHeight > 500) {
            setShowButton(true);
        }
    }, [content]);

    useEffect(() => {
        if (expanded && contentRef.current) {
            setHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setHeight('500px');
        }
    }, [expanded]);

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    return (
        <Card size="small" title="Mô tả">
            <div className="description-container relative">
                <div
                    ref={contentRef}
                    className="text-black overflow-hidden transition-all"
                    dangerouslySetInnerHTML={{ __html: content || '' }}
                    style={{ maxHeight: height }}
                />
                {showButton && (
                    <button
                        onClick={toggleDescription}
                        className="absolute inset-x-0 bottom-0 w-full text-sm text-gray-600 hover:text-orange-500 bg-gradient-to-t from-white to-transparent h-24"
                    >
                        <div className="flex items-end justify-center h-full">
                            {expanded ? 'Ẩn bớt' : 'Xem thêm'}
                        </div>
                    </button>
                )}
            </div>
        </Card>
    );
};

export default ReadMore;