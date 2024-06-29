import React, {useEffect, useState} from "react";
import {Avatar, Card, Image, Segmented} from 'antd';
import {server} from "../utils/server";

const ProductGallery = ({images}: { images: string[] }) => {

    const [selectedImage, setSelectedImage] = useState<string>();

    useEffect((): void => {
        setSelectedImage(images[0]);
    }, [images]);

    return (
        <Card className='h-fit grid gap-4' size='small'>
            <Image className='aspect-square object-cover rounded'
                   width='100%'
                   src={selectedImage ? (server + selectedImage) : (images[0] ? (server + images[0]) : '')}
            />
            <div className='overflow-x-scroll'>
                <Segmented
                    options={images.map((image: string) => ({
                        label: <Avatar size={75} src={server + image}/>,
                        value: image
                    }))}
                    value={selectedImage ?? (images[0] ?? '')}
                    onChange={(image: string) => setSelectedImage(image)}
                />
            </div>
        </Card>
    );

};

export default ProductGallery;