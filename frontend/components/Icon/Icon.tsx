import React, { CSSProperties } from "react";

const Icon: React.FunctionComponent<{
  name: string;
  style?: CSSProperties;
  className?: string;
  size?: number
}> = ({ name, style, className, size = 24 }) => (
  <i style={{ fontSize: size, ...style }} className={`material-icons ${className || ""}`}>
    {name}
  </i>
);

export default Icon;
