import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center bg-[#1B0F12] px-6">
      <div className="text-center max-w-xl">
        {/* Error Code */}
        <p className="text-sm font-semibold tracking-[0.35em] text-[#D4AF37]">
          404 ERROR
        </p>

        {/* Heading */}
        <h1 className="mt-4 text-5xl font-serif tracking-wide text-[#F5DEB3] sm:text-7xl">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg text-[#F5DEB3]/60">
          The page you’re looking for doesn’t exist or has been moved. Let us
          guide you back to a familiar place.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="
              inline-flex items-center gap-2 rounded-md
              border-2 border-[#3A1A22] bg-[#241217] px-5 py-2.5
              text-sm font-semibold text-[#F5DEB3]
              hover:border-[#D4AF37] hover:text-[#D4AF37]
              transition
            "
          >
            <ArrowLeft size={16} />
            Go back
          </button>

          {/* Home Button */}
          <button
            onClick={() => navigate("/")}
            className="
              inline-flex items-center gap-2 rounded-md
              bg-[#D4AF37] px-5 py-2.5
              text-sm font-semibold text-[#1B0F12]
              hover:bg-[#c9a633]
              transition
            "
          >
            <Home size={16} />
            Go to dashboard
          </button>
        </div>
      </div>
    </main>
  );
};

export default PageNotFound;
