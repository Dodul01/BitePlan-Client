const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="relative w-20 h-20">
          <div
            className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[#44C356] border-b-[#44C356] animate-spin"
            style={{ animationDuration: "3s" }}
          ></div>

          <div
            className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[#44C356] animate-spin"
            style={{ animationDuration: "2s", animationDirection: "reverse" }}
          ></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-[#44C356]/10 via-transparent to-[#44C356]/5 animate-pulse rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default Loading;
