import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
}

const SEO = ({ title, description, path = "" }: SEOProps) => {
  const baseUrl = "https://www.neuro-lattice.com"; // Consistently use your primary domain
  const canonicalUrl = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`.replace(/\/$/, ""); 
  // Above ensures no trailing slash for consistency, except for root

  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel="canonical" href={path === "/" ? baseUrl : canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}/favicon.png`} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${baseUrl}/favicon.png`} />
    </Helmet>
  );
};

export default SEO;

