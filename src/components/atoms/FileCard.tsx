import { getThumbnail } from "@/utils/common";
import { Button, Checkbox, Popconfirm } from "antd";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";

export const FileCard = ({
  url,
  handleOnSelected,
  isCheck,
  onDelete,
  showDelete,
  isLoading,
}: {
  url: string;
  handleOnSelected?: () => void;
  isCheck: boolean;
  onDelete?: () => void;
  showDelete?: boolean;
  isLoading?: boolean;
}) => (
  <div
    className="relative p-1 rounded-lg w-fit cursor-pointer group"
    onClick={handleOnSelected}
  >
    {isCheck && (
      <Checkbox checked={isCheck} className="absolute top-0 right-0 z-40" />
    )}
    {showDelete && (
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa mục này không?"
        onConfirm={(e) => {
          e?.stopPropagation();
          onDelete?.();
        }}
      >
        <Button
          size="small"
          onClick={(e) => e.stopPropagation()}
          icon={isLoading ? <LoadingOutlined /> : <DeleteOutlined />}
          className={`absolute bottom-0 right-0 bg-primary rounded-full text-white ${!isLoading && "opacity-0"}  group-hover:opacity-100 z-50 transition-opacity`}
          disabled={isLoading}
        />
      </Popconfirm>
    )}
    <img
      className={`h-20 w-20 rounded-lg object-cover ${isCheck && "border"} rounded-lg border-primary p-1 hover:animate-pulse`}
      src={getThumbnail(url)}
    />
  </div>
);
