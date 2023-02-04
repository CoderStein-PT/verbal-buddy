import { MdSend } from '@react-icons/all-files/md/MdSend'
import { MdMic } from '@react-icons/all-files/md/MdMic'
import { BsLightning } from '@react-icons/all-files/bs/BsLightning'
import { BsLightningFill } from '@react-icons/all-files/bs/BsLightningFill'
import { TooltipWrapper } from 'react-tooltip'
import tw from 'tailwind-styled-components'
import { useStore } from 'store'
import { useVoiceStore } from 'voice-store'

export const IconButton = tw.button<{ $active?: boolean }>`
flex items-center justify-center px-2 transition cursor-pointer
${({ $active }) =>
  $active
    ? 'text-primary-600 hover:text-primary-500'
    : 'text-slate-500 hover:text-primary-600'} active:text-primary-500`

const inputTypeIcons = {
  normal: <BsLightning className="w-4 h-7" />,
  single: <BsLightning className="w-4 h-7" />,
  multiple: <BsLightningFill className="w-4 h-7" />
}

export const InputIcons = ({
  title,
  onClick
}: {
  title?: string
  onClick?: () => void
}) => {
  const settings = useStore((s) => s.settings)
  const recognition = useVoiceStore((s) => s.recognition)

  const onChangeInputMode = () => {
    useStore.setState({
      settings: {
        ...settings,
        inputMode:
          settings.inputMode === 'normal'
            ? 'single'
            : settings.inputMode === 'single'
            ? 'multiple'
            : 'normal'
      }
    })
  }

  const onMicClick = () => {
    useStore.setState({
      settings: {
        ...settings,
        useSpeechRecognition: !settings.useSpeechRecognition
      }
    })
    if (recognition) {
      if (settings.useSpeechRecognition) {
        recognition.stop()
      } else {
        recognition.start()
      }
    }
  }

  return (
    <div className="absolute right-0 top-0 bottom-0 items-center flex">
      <TooltipWrapper
        content={
          'Whether to use speech recognition. If ON - you can say it instead of typing which is much faster.'
        }
        place="top"
      >
        <IconButton
          $active={settings.useSpeechRecognition}
          onClick={onMicClick}
        >
          <MdMic className="w-5 h-7" />
        </IconButton>
      </TooltipWrapper>
      <TooltipWrapper content={''} place="top">
        <IconButton
          $active={settings.inputMode !== 'normal'}
          onClick={onChangeInputMode}
        >
          {inputTypeIcons[settings.inputMode]}
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
