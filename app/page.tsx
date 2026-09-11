import { MarketingHome } from "@/components/marketing/home";
import {
  marketingHomeHeadline,
  marketingHomePromise,
  siteName,
} from "@/lib/copy";
import { pageMetadata } from "@/lib/metadata";

const homepageTitle = `${siteName} | ${marketingHomeHeadline}`;

export const metadata = {
  ...pageMetadata({
    title: marketingHomeHeadline,
    description: marketingHomePromise,
    path: "/",
    socialTitle: homepageTitle,
  }),
  title: { absolute: homepageTitle },
};

export default function Home() {
  return <MarketingHome />;
}
