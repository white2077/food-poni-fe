export default function CardHome({ content }: { content: string }) {
  return (
    <span className="w-auto h-auto pl-[5px] pr-[5px] bg-green-100 text-green-500 rounded-[5px] border-red-900 mr-[5px]">
      {content}
    </span>
  );
}
