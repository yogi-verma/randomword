const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://randomword-teal.vercel.app";

export const siteUrl = configuredSiteUrl.replace(/\/+$/, "");
