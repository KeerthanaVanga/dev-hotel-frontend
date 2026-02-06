import HotelLogo from "../../assets/ravila-logo.png";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B0F12]/70 backdrop-blur-sm">
      {/* Top Linear Loader */}
      <div className="absolute top-0 left-0 w-full h-1 overflow-hidden bg-[#3A1A22]">
        <div
          className="h-full w-1/3 bg-[#D4AF37]"
          style={{
            animation: "loader-slide 1.2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Center Logo */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.25)]">
          <img
            src={HotelLogo}
            alt="Loading"
            className="w-20 h-20 object-contain"
          />
        </div>

        <p className="text-sm tracking-widest uppercase text-[#F5DEB3]/80">
          Preparing your experience
        </p>
      </div>

      {/* Inline keyframes for Tailwind v4 */}
      <style>
        {`
          @keyframes loader-slide {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(300%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default GlobalLoader;
