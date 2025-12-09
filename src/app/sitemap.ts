import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chanhdang.com";
  const locales = ["vi", "en"];

  const routes: MetadataRoute.Sitemap = [];

  // Trang chủ - URL gốc (vi là default)
  routes.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: {
        vi: baseUrl,
        en: `${baseUrl}/en`,
      },
    },
  });

  // Trang chủ cho locale en
  routes.push({
    url: `${baseUrl}/en`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: {
        vi: baseUrl,
        en: `${baseUrl}/en`,
      },
    },
  });

  // Các trang chính
  const mainPages = [
    {
      path: "/music",
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      path: "/blog",
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      path: "/components",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  mainPages.forEach((page) => {
    // URL không có locale (sẽ redirect về vi)
    routes.push({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          vi: `${baseUrl}/vi${page.path}`,
          en: `${baseUrl}/en${page.path}`,
        },
      },
    });

    // URL cho mỗi locale
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            vi: `${baseUrl}/vi${page.path}`,
            en: `${baseUrl}/en${page.path}`,
          },
        },
      });
    });
  });

  return routes;
}

