import { useEffect, useRef, useState } from "react";
import { Card } from "antd";

type Props = {
  readonly content?: string;
};

export default function ReadMore({ content }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("300px");
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((contentRef.current?.scrollHeight ?? 0) > 300) {
      setShowButton(true);
    }
  }, [content]);

  useEffect(() => {
    setHeight(
      expanded && contentRef.current
        ? `${contentRef.current.scrollHeight}px`
        : "300px",
    );
  }, [expanded]);

  const toggleDescription = () => setExpanded((prev) => !prev);

  return (
    <Card size="small" title="Mô tả" className="w-full">
      <div className="description-container relative">
        <div
          ref={contentRef}
          className="text-black overflow-hidden transition-all text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: content || "" }}
          style={{ maxHeight: height }}
        />
        {showButton && (
          <button
            onClick={toggleDescription}
            className={`absolute inset-x-0 bottom-0 w-full text-xs sm:text-sm text-gray-600 hover:text-orange-500 ${expanded ? "" : "bg-gradient-to-t from-white to-transparent"} h-16 sm:h-24`}
          >
            <div className="flex items-end justify-center h-full">
              {expanded ? "Ẩn bớt" : "Xem thêm"}
            </div>
          </button>
        )}
      </div>
    </Card>
  );
}
