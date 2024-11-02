import { fetchFileUploadsAction } from "@/redux/modules/fileUploads";
import { RootState } from "@/redux/store";
import { FolderOutlined } from "@ant-design/icons";
import { Col, Flex, Menu, Popover, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileCard } from "../atoms/FileCard";
import { AdminLayout } from "../templates/AdminLayout";

export const FileManagementPage = () => {
  const dispatch = useDispatch();

  return (
    <AdminLayout>
      <Flex gap="16px">
        <FileTree />
        <FileContent
          fetchFileUploads={() =>
            dispatch(fetchFileUploadsAction({ queryParams: {} }))
          }
        />
      </Flex>
    </AdminLayout>
  );
};

export const FileTree = () => (
  <Col flex="200px">
    <Menu
      theme="light"
      mode="inline"
      defaultOpenKeys={["1"]}
      items={[
        {
          key: "1",
          icon: <FolderOutlined />,
          label: "/public",
        },
        {
          key: "2",
          icon: <FolderOutlined />,
          label: "/folder-01",
        },
      ]}
    />
  </Col>
);

export const FileContent = ({
  fetchFileUploads,
  onSelected,
  multiple = false,
}: {
  fetchFileUploads: () => void;
  onSelected?: (items: Array<string>) => void;
  multiple?: boolean;
}) => {
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.fileUpload
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchFileUploads();
  }, []);

  if (isFetchLoading) {
    return <Spin />;
  }

  return (
    <Col flex="auto">
      <Flex wrap="wrap">
        {page.content.map((it, index) => (
          <Popover key={index} content={<div>{it.url}</div>} placement="bottom">
            <FileCard
              url={it.url}
              isCheck={selectedItems.includes(it.url)}
              handleOnSelected={() => {
                if (!multiple && setSelectedItems) {
                  if (!selectedItems.includes(it.url)) {
                    setSelectedItems([it.url]);
                    onSelected && onSelected([it.url]);
                  } else {
                    setSelectedItems(
                      selectedItems.filter((url) => url !== it.url)
                    );
                    onSelected && onSelected([it.url]);
                  }
                }
              }}
            />
          </Popover>
        ))}
      </Flex>
    </Col>
  );
};
