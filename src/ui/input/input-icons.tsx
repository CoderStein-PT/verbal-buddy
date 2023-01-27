import { MdSend } from '@react-icons/all-files/md/MdSend'
import { MdMic } from '@react-icons/all-files/md/MdMic'
import { TooltipWrapper } from 'react-tooltip'
import tw from 'tailwind-styled-components'

export const IconButton = tw.button`flex items-center justify-center px-2 transition cursor-pointer text-slate-500 hover:text-green-500`

export const InputIcons = ({
  sendTitle,
  micTitle,
  onSendClick,
  onMicClick
}: {
  sendTitle?: string
  micTitle?: string
  onSendClick?: () => void
  onMicClick?: () => void
}) => {
  return (
    <div className="absolute right-0 top-0 bottom-0 items-center flex">
      <TooltipWrapper content={micTitle} place="right">
        <IconButton onClick={onMicClick}>
          <MdMic className="w-5 h-7" />
        </IconButton>
      </TooltipWrapper>
      <TooltipWrapper content={sendTitle} place="right">
        <IconButton onClick={onSendClick}>
          <MdSend className="w-5 h-7" />
        </IconButton>
      </TooltipWrapper>
    </div>
  )
}
