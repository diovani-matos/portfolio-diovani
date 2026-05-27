import { MetadataRoute } from "next";

// TODO: substituir pela URL real após o domínio ser registrado
const BASE_URL = "https://diovanimatos.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
