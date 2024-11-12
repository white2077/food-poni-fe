import { Avatar, Card, Image, Segmented } from "antd";
import { useEffect, useState } from "react";
import { getThumbnail } from "@/utils/common";

const ProductGallery = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState<string>();

  useEffect((): void => {
    setSelectedImage(images[0]);
  }, [images]);

  return (
    <div className="sticky top-5">
      <Card className="h-fit grid gap-4 " size="small">
        <Image
          className="aspect-square object-cover rounded"
          width="100%"
          src={
            selectedImage
              ? getThumbnail(selectedImage)
              : images[0]
                ? getThumbnail(images[0])
                : getThumbnail("")
          }
        />
        <div className="overflow-x-scroll scrollbar-rounded">
          <div className="flex max-w-80 my-2 ">
            <Segmented
              className=" flex gap-2"
              options={images.map((image: string) => ({
                label: (
                  <Avatar
                    className="my-2 rounded-lg"
                    size={75}
                    src={getThumbnail(image)}
                  />
                ),
                value: image,
              }))}
              value={selectedImage ?? images[0] ?? ""}
              onChange={(image: string) => setSelectedImage(image)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductGallery;
