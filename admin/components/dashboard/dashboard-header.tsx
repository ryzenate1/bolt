import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  title,
  description,
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {actions}
    </div>
  );
}

export function DashboardHeaderWithAddButton({
  title,
  description,
  buttonLabel,
  onClick,
}: DashboardHeaderProps & {
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <DashboardHeader
      title={title}
      description={description}
      actions={
        <Button onClick={onClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      }
    />
  );
}