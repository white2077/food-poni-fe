import React, {useState} from "react";
import {Avatar, Segmented, Image} from 'antd';

const images = [
    "https://img.freepik.com/free-psd/fresh-beef-burger-isolated-transparent-background_191095-9018.jpg?size=338&ext=jpg&ga=GA1.1.735520172.1710460800&semt=ais",
    "https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczg3LW1uLTI1LTAxLnBuZw.png",
    "https://w7.pngwing.com/pngs/692/99/png-transparent-hamburger-street-food-seafood-fast-food-delicious-food-salmon-with-vegetables-salad-in-plate-leaf-vegetable-food-recipe-thumbnail.png"
]

const ImageProductDetail = () => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    const handleImageClick = (image: any) => {
        setSelectedImage(image);
    };

    return (
        <div>
            <div>
                <Image
                    width={300}
                    src={selectedImage}
                />
            </div>
            <div>
                <Segmented
                    options={images.map((image, index) => ({
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
        </div>
    )
}

export default ImageProductDetail