import React from 'react';

interface CardHomeProps {
    content: string;
}

const CardHome: React.FC<CardHomeProps> = ({content}) => {
    return (
        <span
            className="w-auto h-auto pl-[5px] pr-[5px] bg-green-100 text-green-500 rounded-[5px] border-red-900 mr-[5px]">
      {content}
    </span>
    );
};

export default CardHome;