import type { CSSProperties } from "react";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

export default function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      style={style}
      className={`animate-pulse rounded-md bg-[#3A1A22] ${className}`}
    />
  );
}
