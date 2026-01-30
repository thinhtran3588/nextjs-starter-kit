import { getRequestConfig } from "next-intl/server";
import enMessages from "../localization/en.json";
import viMessages from "../localization/vi.json";
import zhMessages from "../localization/zh.json";
import { isSupportedLocale, routing } from "./routing";

const messagesByLocale = {
  en: enMessages,
  vi: viMessages,
  zh: zhMessages,
} as const;

type RequestConfigParams = {
  requestLocale: Promise<string | undefined>;
};

export async function requestConfig({ requestLocale }: RequestConfigParams) {
  const locale = await requestLocale;
  const resolvedLocale = isSupportedLocale(locale)
    ? locale
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: messagesByLocale[resolvedLocale],
  };
}

export default getRequestConfig(requestConfig);
