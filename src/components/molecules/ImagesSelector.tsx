import { fetchFileUploadsAction } from "@/redux/modules/fileUploads";
import { Button, Flex, Modal } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FileCard } from "../atoms/FileCard";
import { ScrollPane } from "../atoms/ScrollPane";
import { FileContent, FileTree } from "../pages/FileManagementPage";

export const ImagesSelector = ({
  value,
  onOke,
  className,
}: {
  value?: Array<string>;
  onOke: (value: Array<string>) => void;
  className?: string;
}) => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);

  return (
    <>
      {value &&
        (value as Array<string>).map((it) => (
          <FileCard key={it} url={it} isCheck={selectedItems.includes(it)} />
        ))}
      <Button
        type="dashed"
        className={`${className} p-1`}
        onClick={() => setOpenDialog(true)}
      >
        Choose
      </Button>

      <Modal
        title="Choose thumbnail"
        open={openDialog}
        width={800}
        onCancel={() => setOpenDialog(false)}
        footer={[
          <Button key="back" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>,
          <Button
            key="link"
            type="primary"
            disabled={selectedItems.length === 0}
            onClick={() => {
              if (selectedItems.length > 0) {
                onOke(selectedItems);
                setOpenDialog(false);
              }
            }}
          >
            Choose
          </Button>,
        ]}
      >
        <Flex>
          <FileTree />
          <ScrollPane maxHeight="h-[calc(100vh - 200px)]">
            <FileContent
              defaultSelectedValues={selectedItems}
              fetchFileUploads={() =>
                dispatch(fetchFileUploadsAction({ queryParams: {} }))
              }
              onSelected={(items) => {
                setSelectedItems(items);
              }}
              multiple={true}
            />
          </ScrollPane>
        </Flex>
      </Modal>
    </>
  );
};
