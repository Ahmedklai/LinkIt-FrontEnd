import React from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ children, href, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};
