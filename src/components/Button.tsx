interface Props {
  text: string;
  icon?: JSX.Element;
  intent: "outline" | "filled";
  bgColor?: string;
  textColor?: string;
  outlineColor?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props: Props) {
  return (
    <button
      className={`flex justify-center items-center gap-2 rounded-md shadow py-1 px-3 cursor-pointer transition-all duration-200
      hover:translate-x-0.5 hover:translate-y-[-1px]
      ${props.bgColor} ${props.textColor} ${props.outlineColor ? `outline outline-1 ${props.outlineColor}` : ""}
    `}
      onClick={props.onClick}
    >
      {props.icon}
      {props.text}
    </button>
  );
}
