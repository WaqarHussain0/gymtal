import React from "react";
import clsx from "clsx";

type TextVariants =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "label"
  | "blockquote"
  | "small"
  | "strong"
  | "em"
  | "a";

// Default Tailwind utility classes per element
const defaultClasses: Record<TextVariants, string> = {
  h1: "text-3xl font-semibold text-foreground",
  h2: "text-3xl font-bold",
  h3: "font-[500]",
  h4: "text-[10px] lg:text-[12px] text-[#333333]",
  h5: "",
  h6: "",
  p: "text-muted-foreground",
  span: "text-[#52545B] font-400] text-[12px]",
  label: "text-[14px] font-[400] text-[#4D4D4D]",
  blockquote: "",
  small: "",
  strong: "",
  em: "s",
  a: "text-sm text-green-600 hover:underline",
};

interface TextElementProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextVariants;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TextElement: React.FC<TextElementProps> = ({
  as = "p",
  children,
  className,
  style,
  ...rest
}) => {
  const Component = as;
  const defaultClass = defaultClasses[as] || "";

  return (
    <Component
      className={`${clsx(defaultClass, className)}  `}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default TextElement;
