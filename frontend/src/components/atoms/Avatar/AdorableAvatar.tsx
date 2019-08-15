import React from "react";

const AdorableAvatar: React.FunctionComponent<
  Exclude<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
    email: string;
    size?: number;
  }
> = ({ email, size = 64, ...rest }) => (
  <img
    src={`https://api.adorable.io/avatars/${size}/${email}`}
    alt={`${email}'s avatar`}
    {...rest}
  />
);

export default AdorableAvatar;
