import { RootState } from "@/redux/store";
import { Col, Flex, Popover, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  const { page, isFetchLoading } = useSelector(
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
            <>
              <FileCard
                url={it.url}
                isCheck={
                  selectedItems.length > 0
                    ? selectedItems.includes(it.url)
                    : (defaultSelectedValues &&
                        defaultSelectedValues.includes(it.url)) ||
                      false
                }
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
            </>
          </Popover>
        ))}
      </Flex>
    </Col>
  );
};
