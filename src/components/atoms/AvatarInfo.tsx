import { getThumbnail } from "@/utils/common.ts";
import Countdown from "antd/es/statistic/Countdown";

export const AvatarInfo = ({
  fullName,
  avatar,
  info,
  padding,
  isVisibleCapital,
  timeout,
}: {
  fullName: string;
  avatar: string;
  info: string;
  padding?: string;
  isVisibleCapital?: boolean;
  timeout?: number;
}) => (
  <div className={`flex items-center gap-4 ${padding}`}>
    <div className="relative">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={getThumbnail(avatar)}
        alt=""
      />
      {isVisibleCapital && (
        <span className="absolute text-xl text-primary -bottom-2 right-0">
          ✪
        </span>
      )}
    </div>
    <div className="font-medium dark:text-white">
      <div>{fullName}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{info}</div>
    </div>
    {timeout && <Countdown value={Date.now() + timeout} />}
  </div>
);
