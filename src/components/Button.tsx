
interface Props {
  text: string,
  icon?: JSX.Element,
  intent: 'outline' | 'filled'
}

export default function Button(props: Props) {
  return (
    <button className={`flex justify-center items-center gap-2 rounded-md shadow py-1 px-3 cursor-pointer transition-all duration-200
      hover:translate-x-0.5 hover:translate-y-[-1px]
      ${props.intent === 'filled' 
        ? 'bg-neutral-900 text-white hover:bg-black hover:shadow-md' 
        : 'outline outline-1 outline-neutral-200 text-neutral-800 hover:text-black hover:outline-neutral-400 hover:shadow-md'
      }
    `}>
      {props.icon}
      {props.text}
    </button>
  )
}
