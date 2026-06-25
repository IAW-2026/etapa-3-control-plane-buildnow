import { StatusDelivery, DELIVERY_STATUS_LABELS } from "../types";

interface StatusBadgeProps {
  status: StatusDelivery;
}

type BadgeVariant = "green" | "gray" | "blue";

const DELVERY_STATUS_VARIANT: Record<StatusDelivery, BadgeVariant> = {
  [StatusDelivery.ASSIGNED]: "gray",
  [StatusDelivery.DELIVERED]: "green",
  [StatusDelivery.ON_THE_WAY]: "blue",
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  green: "bg-[#EAF3DE] text-[#3B6D11]",
  gray: "bg-[#F1EFE8] text-[#5F5E5A]",
  blue: "bg-[#E0EFFE] text-[#1B4F9E]",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = DELVERY_STATUS_VARIANT[status];
  const label = DELIVERY_STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${VARIANT_CLASSES[variant]}`}
    >
      {label}
    </span>
  );
}
