import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from "react";

export const AutoDirectionBox = forwardRef<
  HTMLElement,
  PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>
>((props, ref) => {
  return <bdi ref={ref} {...props} />;
});