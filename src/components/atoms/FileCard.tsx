import { getThumbnail } from "@/utils/common";
import { Checkbox } from "antd";

export const FileCard = ({
  url,
  handleOnSelected,
  isCheck,
}: {
  url: string;
  handleOnSelected?: () => void;
  isCheck: boolean;
}) => (
  <div
    className="relative p-1 rounded-lg w-fit cursor-pointer"
    onClick={handleOnSelected}
  >
    {isCheck && (
      <Checkbox checked={isCheck} className="absolute top-0 right-0 z-50" />
    )}
    <img
      className={`h-20 w-20 rounded-lg object-cover ${isCheck && "border"} rounded-lg border-primary p-1 hover:animate-pulse`}
      src={getThumbnail(url)}
    />
  </div>
);
