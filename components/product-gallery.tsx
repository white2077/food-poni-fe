import React, {useState} from "react";
import {Avatar, Card, Image, Segmented} from 'antd';
import {NextPage} from "next";

const ProductGallery = ({images}: { images: string[] }) => {

    const [selectedImage, setSelectedImage] = useState<string>();

    return (
        <Card className='h-fit grid gap-4' size='small'>
            <Image className='aspect-square object-cover rounded'
                   width='100%'
                   src={selectedImage ?? (images[0] ?? '')}
            />
            <div className='overflow-x-scroll'>
                <Segmented
                    options={images.map((image: string, index: number) => ({
                        label: (
                            <div className='p-2'>
                                <Avatar
                                    size={75}
                                    src={image}
                                />
                            </div>
                        ),
                        value: image
                    }))}
                    onChange={(image: string) => setSelectedImage(image)}
                />
            </div>
        </Card>
    );

};

export default ProductGallery;