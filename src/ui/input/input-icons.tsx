import { MdSend } from '@react-icons/all-files/md/MdSend'
import { GoZap } from '@react-icons/all-files/go/GoZap'
import { TooltipWrapper } from 'react-tooltip'
import tw from 'tailwind-styled-components'
import { useStore } from 'store'

export const IconButton = tw.button<{ $active?: boolean }>`
flex items-center justify-center px-2 transition cursor-pointer
${({ $active }) =>
  $active
    ? 'text-primary-600 hover:text-primary-500'
    : 'text-slate-500 hover:text-primary-600'} active:text-primary-500`

export const InputIcons = ({
  title,
  onClick
}: {
  title?: string
  onClick?: () => void
}) => {
  const settings = useStore((s) => s.settings)

  const onFastModeClick = () => {
    useStore.setState({
      settings: { ...settings, fastMode: !settings.fastMode }
    })
  }

  return (
    <div className="absolute right-0 top-0 bottom-0 items-center flex">
      <TooltipWrapper
        content={
          'Whether to use fast mode. If ON - you can say multiple words (or write them separated by a space) and it will send them separately.'
        }
        place="top"
      >
        <IconButton $active={settings.fastMode} onClick={onFastModeClick}>
          <GoZap className="w-3 h-7" />
        </IconButton>
      </TooltipWrapper>
      <TooltipWrapper content={title} place="right">
        <IconButton onClick={onClick}>
          <MdSend className="w-5 h-7" />
        </IconButton>
      </TooltipWrapper>
    </div>
  )
}
