import Link from "next/link";
import { ErrorPageView } from "@/common/components/error-page-view";
import { Button } from "@/common/components/button";

export default function RootNotFound() {
  return (
    <ErrorPageView
      eyebrow="Not found"
      errorCode="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      primaryAction={
        <Button asChild variant="default">
          <Link href="/">Back to home</Link>
        </Button>
      }
    />
  );
}
