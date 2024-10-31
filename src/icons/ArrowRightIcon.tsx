import React from "react";

interface Props {
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
  className?: string;
}

const ArrowRightIcon: React.FC<Props> = ({
  size = 16,
  strokeWidth = 1.5,
  strokeColor = "currentColor",
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke={strokeColor}
      className={`size-${size} ${className}`}
      width={size}
      height={size}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
};

export default ArrowRightIcon;
