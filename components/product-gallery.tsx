import React, {useState} from "react";
import {Avatar, Card, Image, Segmented} from 'antd';
import {NextPage} from "next";

const ProductGallery = ({images}: { images: string[] }) => {

    const [selectedImage, setSelectedImage] = useState<string>();

    const handleImageClick = (image: string): void => {
        setSelectedImage(image);
    };

    return (
        <Card className='h-fit grid gap-4' size='small'>
            <Image className='aspect-square object-cover rounded'
                   width='100%'
                   src={selectedImage ?? (images[0] ?? '')}
            />
            <div className='overflow-x-scroll'>
                <Segmented
                    options={images ? images?.map((image: string, index: number) => ({
                        label: (
                            <div style={{padding: 4}}>
                                <Avatar
                                    size={75}
                                    src={image}
                                    onClick={() => handleImageClick(image)}
                                />
                            </div>
                        ),
                        value: `image${index}`,
                    })) : []}
                />
            </div>
        </Card>
    );

};

export default ProductGallery;