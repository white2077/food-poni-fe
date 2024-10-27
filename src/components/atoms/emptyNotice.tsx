type Props = {
  w: string;
  h: string;
  src: string;
  message: string;
};

export default function EmptyNotice({ w, h, src, message }: Props) {
  return (
    <div className="w-full h-full object-cover flex justify-center">
      <div>
        <div className="flex justify-center">
          <img
            className={`w-${w} h-${h} object-cover`}
            src={src}
            alt="No Product"
          />
        </div>
        <div className="text-2xl text-center text-gray-500 font-medium">
          {message}
        </div>
      </div>
    </div>
  );
}
