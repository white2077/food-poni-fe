import { ReactNode } from "react";

export const ScrollPane = ({
  children,
  maxHeight,
}: {
  children: ReactNode;
  maxHeight?: string;
}) => (
  <div className={`${maxHeight} overflow-y-auto pr-2 scrollbar-rounded`}>
    {children}
  </div>
);
