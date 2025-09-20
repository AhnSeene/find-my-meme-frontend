import { useState } from "react";

export default function ResponsiveImage({ mediaInfo }) {
  const [showFallback, setShowFallback] = useState(false);

  if (!mediaInfo) return null;
  const { mediaType, thumbnails, originalSource, altText } = mediaInfo;
  const sortedSources = [...thumbnails].sort((a, b) => b.minWidth - a.minWidth);

  if (mediaType === "ANIMATED") {
    if (showFallback) {
      return (
        <img
          key="fallback-gif"
          src={originalSource.url}
          alt={altText}
          style={{ width: "100%" }}
        />
      );
    }
    return (
      <video
        playsInline
        autoPlay
        muted
        loop
        preload="none"
        aria-label={altText}
        style={{ width: "100%", height: "auto" }}
        onError={() => setShowFallback(true)}
      >
        {sortedSources.map((source) => (
          <source
            key={source.url}
            src={source.url}
            type={source.mimeType}
            media={
              source.minWidth > 0
                ? `(min-width: ${source.minWidth}px)`
                : undefined
            }
          />
        ))}
      </video>
    );
  }

  //mediaType이 STATIC
  return (
    <picture>
      {sortedSources.map((source) => (
        <source
          key={source.url}
          srcSet={source.url}
          type={source.mimeType}
          media={
            source.minWidth > 0
              ? `(min-width: ${source.minWidth}px)`
              : undefined
          }
        />
      ))}
      <img src={originalSource.url} alt={altText} style={{ width: "100%" }} />
    </picture>
  );
}
