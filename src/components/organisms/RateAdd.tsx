import { useEffect } from "react";
import { Button, Image, Input, Modal, Rate } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setShowModalAddRate,
  setShowModalFileUpload,
  createRateAction,
  updateRateForm,
} from "@/redux/modules/rate";
import { unSelectedMultiFile } from "@/redux/modules/fileUploads";
import FileUploads from "./FileUploads";

const RateAdd = () => {
  const dispatch = useDispatch();
  const { showModalAddRate, form } = useSelector(
    (state: RootState) => state.rate
  );
  const selectedImages = useSelector(
    (state: RootState) => state.fileUpload.selectedMultiFile
  );

  useEffect(() => {
    dispatch(updateRateForm({ images: selectedImages }));
  }, [selectedImages, dispatch]);

  return (
    <Modal
      title="Đánh giá sản phẩm"
      open={showModalAddRate}
      footer={null}
      onCancel={() => {
        dispatch(setShowModalAddRate(false));
        dispatch(unSelectedMultiFile());
        dispatch(updateRateForm({ rate: 0, message: "", images: [] }));
      }}
    >
      <div className="p-1">
        <Rate
          value={form.rate}
          onChange={(value: number) => {
            dispatch(updateRateForm({ rate: value }));
          }}
          style={{ fontSize: "50px" }}
        />
        <Input.TextArea
          showCount
          maxLength={100}
          placeholder="Nhập tin nhắn đánh giá"
          onChange={(e) => {
            dispatch(updateRateForm({ message: e.target.value }));
          }}
          value={form.message}
        />
        <div className="grid grid-cols-4 gap-4 mt-2 overflow-y-scroll scrollbar-rounded max-h-64">
          {form.images.map((url: string, index: number) => (
            <Image
              className="rounded-lg !h-32 object-cover !w-28"
              key={index}
              src={url}
              alt={`Image ${index}`}
            />
          ))}
        </div>
        <div className="flex gap-2 my-3">
          <Button
            onClick={() => {
              dispatch(setShowModalFileUpload(true));
            }}
          >
            Chọn ảnh
          </Button>
          <Button
            disabled={form.rate === 0}
            type="primary"
            onClick={() => {
              dispatch(createRateAction());
            }}
          >
            Gửi đánh giá
          </Button>
        </div>
      </div>
      <FileUploads />
    </Modal>
  );
};

export default RateAdd;
