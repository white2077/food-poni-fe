import {
  deleteFileAction,
  setShowModalFileUpload,
  updateFileUploadForm,
  uploadFileAction,
} from "@/redux/modules/fileUploads";
import { RootState } from "@/redux/store";
import { UploadOutlined } from "@ant-design/icons";
import { Col, Flex, Modal, Popover, Spin, Upload } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileCard } from "../atoms/FileCard";

export const FileContent = ({
  defaultSelectedValues,
  multiple = false,
  fetchFileUploads,
  onSelected,
}: {
  defaultSelectedValues?: Array<string>;
  multiple?: boolean;
  fetchFileUploads: () => void;
  onSelected?: (items: Array<string>) => void;
}) => {
  const dispatch = useDispatch();
  const { page, isFetchLoading, showModalFileUpload } = useSelector(
    (state: RootState) => state.fileUpload
  );

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    if (multiple) {
      setSelectedItems(defaultSelectedValues || []);
    }
  }, [defaultSelectedValues, multiple]);

  useEffect(() => {
    setSelectedItems(defaultSelectedValues || []);
    fetchFileUploads();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (file: RcFile) => {
    dispatch(updateFileUploadForm({ file }));
    dispatch(uploadFileAction());
    dispatch(setShowModalFileUpload(false));
    return false;
  };

  if (isFetchLoading) {
    return <Spin />;
  }

  return (
    <Col flex="auto">
      <Flex wrap="wrap">
        {page.content.map((it, index) => (
          <Popover
            key={index}
            content={<div>{it.extension}</div>}
            placement="bottom"
          >
            <FileCard
              url={it.url}
              isCheck={
                selectedItems.length > 0
                  ? selectedItems.includes(it.url)
                  : (defaultSelectedValues &&
                      defaultSelectedValues.includes(it.url)) ||
                    false
              }
              showDelete={true}
              isLoading={it.isDeleteLoading}
              onDelete={() => dispatch(deleteFileAction(it.id))}
              handleOnSelected={() => {
                if (onSelected) {
                  if (!multiple && setSelectedItems) {
                    if (!selectedItems.includes(it.url)) {
                      setSelectedItems([it.url]);
                      onSelected([it.url]);
                    } else {
                      setSelectedItems(
                        selectedItems.filter((url) => url !== it.url)
                      );
                      onSelected([]);
                    }
                  }

                  if (multiple) {
                    const values = selectedItems.includes(it.url)
                      ? selectedItems.filter((url) => url !== it.url)
                      : [...selectedItems, it.url];

                    setSelectedItems(values);
                    onSelected(values);
                  }
                }
              }}
            />
          </Popover>
        ))}
      </Flex>

      <Modal
        title="Upload File"
        open={showModalFileUpload}
        onCancel={() => dispatch(setShowModalFileUpload(false))}
        footer={null}
      >
        <Upload.Dragger
          name="file"
          multiple={false}
          beforeUpload={handleUpload}
          showUploadList={false}
          accept="image/*"
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấp hoặc kéo file vào khu vực này để tải lên
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ tải lên một hình ảnh duy nhất
          </p>
        </Upload.Dragger>
      </Modal>
    </Col>
  );
};
