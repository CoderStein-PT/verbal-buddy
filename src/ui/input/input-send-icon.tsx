import { MdSend } from '@react-icons/all-files/md/MdSend'
import { TooltipWrapper } from 'react-tooltip'

export const InputSendIcon = ({
  title,
  onClick
}: {
  title?: string
  onClick?: () => void
}) => {
  return (
    <TooltipWrapper content={title} place="right">
      <button
        onClick={onClick}
        className="absolute top-0 bottom-0 right-0 flex items-center justify-center px-2 transition cursor-pointer text-slate-500 hover:text-green-500"
      >
        <MdSend className="w-5 h-5" />
      </button>
    </TooltipWrapper>
  )
}
