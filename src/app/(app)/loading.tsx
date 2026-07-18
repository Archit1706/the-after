import { Spinner } from "@/components/ui/spinner";

export default function AppLoading() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <Spinner label="Loading your plan" />
    </div>
  );
}
