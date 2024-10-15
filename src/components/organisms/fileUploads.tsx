import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, List, Modal, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RootState } from "@/redux/store";
import {
  selectedMultiFile,
  uploadFileRequest,
  fetchFileUploadsRequest,
} from "@/redux/modules/fileUploads";
import { setShowModalFileUpload } from "@/redux/modules/rate";
import { REFRESH_TOKEN } from "@/utils/server";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { FileUpload } from "@/type/types";
import Cookies from "js-cookie";

export default function FileUploads() {
  const dispatch = useDispatch();
  const refreshToken = Cookies.get(REFRESH_TOKEN);
  const {
    filesUpload,
    isUploading,
    selectedMultiFile: selectedFiles,
  } = useSelector((state: RootState) => state.fileUpload);
  const { showModalFileUpload } = useSelector((state: RootState) => state.rate);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (refreshToken) {
      dispatch(fetchFileUploadsRequest(refreshToken));
    }
  }, [dispatch, refreshToken]);

  return (
    <Modal
      title="Tải hình ảnh"
      open={showModalFileUpload}
      footer={null}
      onCancel={() => dispatch(setShowModalFileUpload(false))}
    >
      <List
        className="scrollbar-rounded overflow-scroll max-h-96 h-96 p-2"
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
        dataSource={filesUpload}
        renderItem={(file: FileUpload) => (
          <List.Item>
            <div
              onClick={() => {
                const newSelectedFiles = selectedFiles.includes(file.url)
                  ? selectedFiles.filter((url) => url !== file.url)
                  : [...selectedFiles, file.url];
                dispatch(selectedMultiFile(newSelectedFiles));
              }}
              className="p-0 relative"
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div
                className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full border-2 border-orange-200"
                style={{ backgroundColor: "rgba(128, 128, 128, 0.5)" }}
              >
                {selectedFiles.includes(file.url) && (
                  <div className="w-full h-full bg-orange-400 text-white rounded-full flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>
            </div>
          </List.Item>
        )}
      />
      <Divider />
      <div style={{ marginTop: 20, textAlign: "right" }}>
        {contextHolder}
        <Upload
          customRequest={async ({
            file,
            onSuccess,
            onError,
          }: UploadRequestOption): Promise<void> => {
            if (refreshToken && file instanceof File) {
              try {
                await dispatch(uploadFileRequest({ refreshToken, file }));
                onSuccess?.("OK");
              } catch (err) {
                onError?.(new Error("Upload failed"));
              }
            }
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />} loading={isUploading}>
            Upload
          </Button>
        </Upload>
        <Button
          type="primary"
          style={{ marginLeft: 10 }}
          onClick={(): void => {
            if (selectedFiles.length > 0) {
              dispatch(setShowModalFileUpload(false));
            } else {
              messageApi.warning("Bạn chưa chọn ảnh nào!");
            }
          }}
        >
          Chọn ảnh
        </Button>
      </div>
    </Modal>
  );
}
