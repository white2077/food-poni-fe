import React, {useState} from "react";
import {Avatar, Card, Image, Segmented} from 'antd';

const ImageProductDetail = ({images}: { images: string[] }) => {
    const [selectedImage, setSelectedImage] = useState<string>();

    const handleImageClick = (image: string) => {
        setSelectedImage(image);
    };

    return (
        <Card size='small'>
            <Image
                style={{aspectRatio: '1', objectFit: 'cover'}}
                src={selectedImage ? selectedImage : images?.[0]}
            />
            <div>
                <Segmented
                    options={images?.map((image, index) => ({
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
                    }))}
                />
            </div>
        </Card>
    )
}

export default ImageProductDetail