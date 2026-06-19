import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorMessage({
  title,
  message,
  onRetry,
  retryLabel,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{message}</span>
        {onRetry && (
          <div>
            <Button variant="outline" size="sm" onClick={onRetry}>
              {retryLabel || "Tentar novamente"}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
