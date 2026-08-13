import axios from "axios";
import React, { useState } from "react";

interface FormData {
  originalUrl: string;
  customAlias: string;
}

interface ShortUrlResponse {
  originalUrl: string;
  shortCode: string;
  customAlias: string;
  clickCount: number;
  qrCode: string;
  isActive: boolean;
  shortUrl: string;
  expiresAt: string;
  isReachable: boolean;
}
interface HomeProps {
  themeMode: boolean;
}
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const Home = ({ themeMode }: HomeProps) => {
  console.log("IN HOme: ", themeMode);
  const [formData, setFormData] = useState<FormData>({
    originalUrl: "",
    customAlias: "",
  });

  const [result, setResult] = useState<ShortUrlResponse | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const downloadBtn = async (code: string) => {
    try {
      const res = await axios.get<Blob>(
        `http://localhost:5000/api/v1/links/${code}/download`,
        {
          responseType: "blob",
        },
      );
      console.log(res);
      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `${code}.png`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || err.message || "Something went wrong",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.originalUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post<ApiResponse<ShortUrlResponse>>(
        "http://localhost:5000/api/v1/links",
        formData,
      );

      setResult(response.data.data);

      setFormData({
        originalUrl: "",
        customAlias: "",
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || err.message || "Something went wrong",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`
      min-h-screen
      pt-16
      transition-colors duration-500
      ${themeMode ? "bg-[#08070f] text-white" : "bg-slate-50 text-slate-900"}
    `}
    >
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        {/* Background Glow */}
        <div
          className={`
          pointer-events-none absolute left-1/2 top-0
          h-[500px] w-[700px]
          -translate-x-1/2
          rounded-full
          blur-3xl
          opacity-30
          ${themeMode ? "bg-violet-700/30" : "bg-violet-300/40"}
        `}
        />

        <div className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {/* ================= TITLE ================= */}
          <div className="mb-10 text-center">
            <h1
              className={`
              text-4xl font-extrabold tracking-tight
              sm:text-5xl
              lg:text-6xl
              ${themeMode ? "text-slate-100" : "text-slate-900"}
            `}
            >
              Shorten Your{" "}
              <span
                className="
                bg-gradient-to-r
                from-violet-500
                via-purple-500
                to-indigo-500
                bg-clip-text
                text-transparent
              "
              >
                URL
              </span>
            </h1>

            <p
              className={`
              mt-4 text-sm
              sm:text-base
              ${themeMode ? "text-slate-400" : "text-slate-500"}
            `}
            >
              Fast, smart & trackable short links — with QR codes built in
            </p>
          </div>

          {/* ================= URL FORM ================= */}
          <div
            className={`
    mx-auto
    rounded-2xl
    border
    p-4
    shadow-2xl
    backdrop-blur-xl
    transition-all duration-500
    sm:p-5
    ${
      themeMode
        ? "border-white/10 bg-[#15121f]/90 shadow-violet-950/20"
        : "border-slate-200 bg-white/90 shadow-slate-200"
    }
  `}
          >
            {/* ================= LONG URL ================= */}
            <div className="w-full">
              <input
                value={formData.originalUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalUrl: e.target.value,
                  })
                }
                type="text"
                placeholder="Paste your long URL here..."
                className={`
        h-12
        w-full
        rounded-xl
        border
        px-4
        text-sm
        outline-none
        transition-all duration-300
        focus:ring-2
        sm:h-14
        ${
          themeMode
            ? `
              border-white/10
              bg-[#211d2c]
              text-white
              placeholder:text-slate-500
              focus:border-violet-500/50
              focus:ring-violet-500/20
            `
            : `
              border-slate-200
              bg-slate-50
              text-slate-800
              placeholder:text-slate-400
              focus:border-violet-400
              focus:ring-violet-200
            `
        }
      `}
              />
            </div>

            {/* ================= ALIAS + BUTTON ================= */}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {/* Custom Alias */}
              <div className="min-w-0 flex-1">
                <input
                  value={formData.customAlias}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customAlias: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Custom Alias (Optional)"
                  className={`
          h-12
          w-full
          rounded-xl
          border
          px-4
          text-sm
          outline-none
          transition-all duration-300
          focus:ring-2
          sm:h-14
          ${
            themeMode
              ? `
                border-white/10
                bg-[#211d2c]
                text-white
                placeholder:text-slate-500
                focus:border-violet-500/50
                focus:ring-violet-500/20
              `
              : `
                border-slate-200
                bg-slate-50
                text-slate-800
                placeholder:text-slate-400
                focus:border-violet-400
                focus:ring-violet-200
              `
          }
        `}
                />
              </div>

              {/* Shorten Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="
        h-12
        w-full
        shrink-0
        rounded-xl
        bg-gradient-to-r
        from-violet-600
        via-purple-600
        to-indigo-600
        px-8
        text-sm
        font-bold
        text-white
        shadow-lg
        shadow-violet-500/20
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-xl
        hover:shadow-violet-500/30
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:h-14
        sm:w-auto
      "
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-white/30
              border-t-white
            "
                    />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Shorten
                    <span className="text-lg">→</span>
                  </span>
                )}
              </button>
            </div>

            {/* ================= ERROR ================= */}
            {error && (
              <div
                className={`
        mt-3
        rounded-lg
        border
        px-4
        py-3
        text-sm
        font-medium
        ${
          themeMode
            ? "border-red-500/20 bg-red-500/10 text-red-400"
            : "border-red-200 bg-red-50 text-red-600"
        }
      `}
              >
                {error}
              </div>
            )}
          </div>

          {/* ================= RESULT ================= */}
          {result && (
            <div
              className={`
              mt-7
              overflow-hidden
              rounded-2xl
              border
              shadow-2xl
              transition-all duration-500
              ${
                themeMode
                  ? "border-white/10 bg-[#15121f] shadow-black/30"
                  : "border-slate-200 bg-white shadow-slate-200"
              }
            `}
            >
              <div className="grid lg:grid-cols-[1fr_210px]">
                {/* ================= LEFT CONTENT ================= */}
                <div className="p-5 sm:p-7">
                  {/* Short URL */}
                  <div>
                    <p
                      className={`
                      mb-2 text-xs font-bold uppercase tracking-widest
                      ${themeMode ? "text-slate-500" : "text-slate-400"}
                    `}
                    >
                      Short URL
                    </p>

                    <div
                      className={`
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      p-2
                      ${
                        themeMode
                          ? "border-white/10 bg-[#211d2c]"
                          : "border-slate-200 bg-slate-50"
                      }
                    `}
                    >
                      <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                        min-w-0
                        flex-1
                        truncate
                        px-2
                        py-2
                        text-sm
                        font-bold
                        text-violet-500
                        transition-colors
                        hover:text-violet-400
                        hover:underline
                        sm:text-base
                      "
                      >
                        {result.shortUrl}
                      </a>

                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(result.shortUrl)
                        }
                        className={`
                        shrink-0
                        rounded-lg
                        border
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        transition-all
                        ${
                          themeMode
                            ? `
                              border-violet-400/20
                              bg-violet-500/10
                              text-violet-300
                              hover:bg-violet-500/20
                            `
                            : `
                              border-violet-200
                              bg-violet-50
                              text-violet-600
                              hover:bg-violet-100
                            `
                        }
                      `}
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>

                  {/* Original URL */}
                  <div className="mt-5">
                    <p
                      className={`
                      mb-1 text-xs font-bold uppercase tracking-widest
                      ${themeMode ? "text-slate-500" : "text-slate-400"}
                    `}
                    >
                      Original URL
                    </p>

                    <p
                      className={`
                      break-all text-sm leading-6
                      ${themeMode ? "text-slate-400" : "text-slate-500"}
                    `}
                    >
                      {result.originalUrl}
                    </p>
                  </div>

                  {/* ================= STATS ================= */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {/* Clicks */}
                    <div
                      className={`
                      flex items-center gap-1.5 text-xs font-medium
                      ${themeMode ? "text-slate-400" : "text-slate-500"}
                    `}
                    >
                      <span>👁</span>
                      <span>{result.clickCount} clicks</span>
                    </div>

                    {/* Date */}
                    {result.expiresAt && (
                      <div
                        className={`
                        flex items-center gap-1.5 text-xs font-medium
                        ${themeMode ? "text-slate-400" : "text-slate-500"}
                      `}
                      >
                        <span>📅Expires On</span>
                        <span>
                          {new Date(result.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Alias */}
                    <div
                      className={`
                      flex items-center gap-1.5 text-xs font-medium
                      ${themeMode ? "text-slate-400" : "text-slate-500"}
                    `}
                    >
                      <span>🔑</span>
                      <span className=" text-sm">
                        Code: {result.customAlias || result.shortCode}
                      </span>
                    </div>
                  </div>

                  {/* Reachable */}
                  <div className="mt-5">
                    {result.isReachable ? (
                      <span
                        className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-emerald-500/20
                        bg-emerald-500/10
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-emerald-500
                      "
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Valid Website
                      </span>
                    ) : (
                      <span
                        className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-red-500
                      "
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Website Not Reachable
                      </span>
                    )}
                  </div>
                </div>

                {/* ================= QR SECTION ================= */}
                <div
                  className={`
                  flex
                  flex-col
                  items-center
                  justify-center
                  border-t
                  p-5
                  lg:border-l
                  lg:border-t-0
                  ${
                    themeMode
                      ? "border-white/10 bg-[#100e17]"
                      : "border-slate-100 bg-slate-50"
                  }
                `}
                >
                  <p
                    className={`
                    mb-4
                    text-xs
                    font-bold
                    uppercase
                    tracking-widest
                    ${themeMode ? "text-slate-500" : "text-slate-400"}
                  `}
                  >
                    QR Code
                  </p>

                  <div className="rounded-xl bg-white p-3 shadow-lg">
                    <img
                      src={`http://localhost:5000${result.qrCode}`}
                      alt="QR Code"
                      className="
                      h-40
                      w-40
                      object-contain
                      sm:h-44
                      sm:w-44
                    "
                    />
                  </div>

                  <button
                    onClick={() =>
                      downloadBtn(result.customAlias || result.shortCode)
                    }
                    className="
                    mt-4
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-blue-400/20
                    bg-blue-500/10
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-blue-500
                    transition-all duration-300
                    hover:bg-blue-500/20
                    hover:-translate-y-0.5
                  "
                  >
                    ↓ Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
