interface Props {
  toggleValue: boolean;
  setToggleValue: (val: boolean) => void;
}

export default function ToggleButton(props: Props) {
  return (
    <div
      className={`w-12 h-6 p-1 rounded-full shadow-sm outline-neutral-400 cursor-pointer transition-all duration-200 ${
        props.toggleValue ? 'bg-neutral-900' : 'bg-neutral-400'
      }`}
      onClick={() => {
        props.setToggleValue(!props.toggleValue);
      }}
    >
      <div
        className="h-full aspect-square rounded-full bg-neutral-100 relative transition-all duration-200"
        style={{
          left: props.toggleValue ? '100%' : '0%',
          transform: props.toggleValue ? 'translateX(-100%)' : '',
        }}
      />
    </div>
  );
}
