import { Helmet } from "react-helmet-async";

export function Seo({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path?: string;
}) {
  const fullTitle = title.includes("Resume & Career Tools")
    ? title
    : `${title} | Resume & Career Tools`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {path && <meta property="og:url" content={path} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
