import { useState, useEffect } from "react";
import { Button, Image, Input, Modal, Rate } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  createRateRequest,
  setShowModalAddRate,
  setShowModalFileUpload,
} from "@/redux/modules/rate";
import { unSelectedMultiFile } from "@/redux/modules/fileUploads";
import FileUploads from "./fileUploads";

const RateAdd = () => {
  const dispatch = useDispatch();
  const showModalAddRate = useSelector(
    (state: RootState) => state.rate.showModalAddRate
  );
  const orderItemId = useSelector(
    (state: RootState) => state.rate.selectOrderItemRate
  );
  const selectedImages = useSelector(
    (state: RootState) => state.fileUpload.selectedMultiFile
  );

  const [rate, setRate] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    console.log("RateAdd effect, showModalAddRate:", showModalAddRate);
  }, [showModalAddRate]);

  const handleSubmit = () => {
    if (rate === 0) {
      // Show error notification
      return;
    }
    dispatch(
      createRateRequest({
        orderItemId,
        rateRequest: {
          rate,
          message,
          images: selectedImages,
          name: "",
          thumbnail: "",
          username: "",
          avatar: "",
        },
      })
    );
  };

  const handleModalClose = () => {
    dispatch(setShowModalAddRate(false));
    dispatch(unSelectedMultiFile());
    setRate(0);
    setMessage("");
  };

  const handleOpenFileUploadModal = () => {
    dispatch(setShowModalFileUpload(true));
  };

  return (
    <Modal
      title="Đánh giá sản phẩm"
      open={showModalAddRate}
      footer={null}
      onCancel={handleModalClose}
    >
      <div className="p-1">
        <Rate value={rate} onChange={setRate} style={{ fontSize: "50px" }} />
        <Input.TextArea
          showCount
          maxLength={100}
          placeholder="Nhập tin nhắn đánh giá"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <div className="grid grid-cols-4 gap-4 mt-2 overflow-y-scroll scrollbar-rounded max-h-64">
          {selectedImages.map((url: string, index: number) => (
            <Image
              className="rounded-lg !h-32 object-cover !w-28"
              key={index}
              src={url}
              alt={`Image ${index}`}
            />
          ))}
        </div>
        <div className="flex gap-2 my-3">
          <Button onClick={handleOpenFileUploadModal}>Chọn ảnh</Button>
          <Button type="primary" onClick={handleSubmit}>
            Gửi đánh giá
          </Button>
        </div>
      </div>
      <FileUploads />
    </Modal>
  );
};

export default RateAdd;
