import { fetchFileUploadsAction } from "@/redux/modules/fileUploads";
import { getThumbnail } from "@/utils/common";
import { Button, Flex, Modal } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FileCard } from "../atoms/FileCard";
import { ScrollPane } from "../atoms/ScrollPane";
import { FileContent, FileTree } from "../pages/FileManagementPage";

export const ImagesSelector = ({
  value,
  onOke,
  multiple,
  className,
}: {
  value?: string;
  onOke: (value: Array<string>) => void;
  multiple?: boolean;
  className?: string;
}) => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <>
      {multiple ? (
        <>
          {selectedItems.map((it) => (
            <FileCard key={it} url={it} isCheck={selectedItems.includes(it)} />
          ))}
          <Button
            type="dashed"
            className={`${className} p-1`}
            onClick={() => setOpenDialog(true)}
          >
            Choose
          </Button>
        </>
      ) : (
        <Button
          type="dashed"
          className={`${className} p-1`}
          onClick={() => setOpenDialog(true)}
        >
          {value ? (
            <img
              className="h-full w-full object-cover"
              src={getThumbnail(value)}
            />
          ) : (
            "Choose"
          )}
        </Button>
      )}
      <Modal
        title="Choose thumbnail"
        open={openDialog}
        onOk={() => {
          if (selectedItems.length > 0) {
            onOke(selectedItems);
            setOpenDialog(false);
          }
        }}
        onCancel={() => {
          setOpenDialog(false);
        }}
        width={800}
      >
        <Flex>
          <FileTree />
          <ScrollPane maxHeight="h-[calc(100vh - 200px)]">
            <FileContent
              fetchFileUploads={() =>
                dispatch(fetchFileUploadsAction({ queryParams: {} }))
              }
              onSelected={(items) => {
                setSelectedItems(items);
              }}
              multiple={multiple}
            />
          </ScrollPane>
        </Flex>
      </Modal>
    </>
  );
};
