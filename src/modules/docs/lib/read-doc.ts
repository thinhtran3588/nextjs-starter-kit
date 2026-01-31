import type { Locale } from "@/application/routing/routing";
import { isDocSlug } from "@/common/config/docs";
import { readFile } from "node:fs/promises";
import path from "path";

function getDocFilename(slug: string, locale: Locale): string {
  if (locale === "en") {
    return `${slug}.md`;
  }
  return `${slug}-${locale}.md`;
}

export type ReadFileFn = (path: string, encoding: "utf-8") => Promise<string>;

export async function readDocContent(
  slug: string,
  locale: Locale,
  readFileFn: ReadFileFn = readFile,
): Promise<string | null> {
  if (!isDocSlug(slug)) {
    return null;
  }
  const filename = getDocFilename(slug, locale);
  const filePath = path.join(process.cwd(), "docs", filename);
  try {
    const content = await readFileFn(filePath, "utf-8");
    return content;
  } catch {
    return null;
  }
}
