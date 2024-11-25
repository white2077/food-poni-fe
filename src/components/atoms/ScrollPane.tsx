import { ReactNode, UIEventHandler } from "react";

export const ScrollPane = ({
  children,
  maxHeight,
  onScroll,
}: {
  children: ReactNode;
  maxHeight?: string;
  onScroll?: UIEventHandler<HTMLDivElement>;
}) => (
  <div
    className={`${maxHeight} overflow-y-auto pr-2 scrollbar-rounded`}
    onScroll={onScroll}
  >
    {children}
  </div>
);
