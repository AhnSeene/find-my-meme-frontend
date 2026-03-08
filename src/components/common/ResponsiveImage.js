export default function ResponsiveImage({ mediaInfo }) {
  if (!mediaInfo) return null;
  const { mediaType, thumbnails, originalSource, altText } = mediaInfo;
  const sortedSources = [...thumbnails].sort((a, b) => b.minWidth - a.minWidth);

  if (mediaType === "ANIMATED") {
    return (
      <picture>
        {sortedSources.map((source) => (
          <source
            key={source.url}
            srcSet={source.url}
            type="image/webp"
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
