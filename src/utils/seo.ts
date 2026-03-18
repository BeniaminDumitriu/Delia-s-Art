export function updatePageMeta(data: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}) {
  // Update title
  if (data.title) {
    document.title = data.title;
    updateMetaTag('og:title', data.title);
    updateMetaTag('twitter:title', data.title);
  }

  // Update description
  if (data.description) {
    updateMetaTag('description', data.description);
    updateMetaTag('og:description', data.description);
    updateMetaTag('twitter:description', data.description);
  }

  // Update image
  if (data.image) {
    updateMetaTag('og:image', data.image);
    updateMetaTag('twitter:image', data.image);
  }

  // Update URL
  if (data.url) {
    updateMetaTag('og:url', data.url);
    updateMetaTag('twitter:url', data.url);
    updateLinkTag('canonical', data.url);
  }
}

function updateMetaTag(property: string, content: string) {
  // Try property attribute first (for og: tags)
  let element = document.querySelector(`meta[property="${property}"]`);
  
  // If not found, try name attribute
  if (!element) {
    element = document.querySelector(`meta[name="${property}"]`);
  }

  if (element) {
    element.setAttribute('content', content);
  } else {
    // Create new meta tag if it doesn't exist
    const meta = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (element) {
    element.setAttribute('href', href);
  } else {
    const link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    document.head.appendChild(link);
  }
}
