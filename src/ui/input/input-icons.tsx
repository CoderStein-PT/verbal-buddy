import { MdSend } from '@react-icons/all-files/md/MdSend'
import { MdMic } from '@react-icons/all-files/md/MdMic'
import { BsLightning } from '@react-icons/all-files/bs/BsLightning'
import { BsLightningFill } from '@react-icons/all-files/bs/BsLightningFill'
import { TooltipWrapper } from 'react-tooltip'
import tw from 'tailwind-styled-components'
import { SettingsType, useStore } from 'store'
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

export const inputModeHtml = (mode: SettingsType['inputMode']) => `
  <div><span class="font-bold">Current input mode: </span><span class="text-primary-500" >${
    mode ? mode[0]?.toUpperCase() + mode.slice(1) : ''
  }</span></div>
  <div class="space-y-2 mt-2 pt-2 border-t border-gray-600" >
    <div>
      <span class="font-bold">Normal:</span>
      <span>Type/say anything and press enter</span>
    </div>
    <div>
      <span class="font-bold">Single:</span>
      <span>Type/say all the words separated by comma and press enter</span>
    </div>
    <div>
      <span class="font-bold">Multiple:</span>
      <span>Say phrases and it submits them automatically</span>
    </div>
  </div>
`

export const InputIcons = ({
  title,
  onClick
}: {
  title?: string
  onClick?: () => void
}) => {
  const settings = useStore((s) => s.settings)
  const startRecognition = useVoiceStore((s) => s.startRecognition)
  const stopRecognition = useVoiceStore((s) => s.stopRecognition)

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
    if (settings.useSpeechRecognition) {
      stopRecognition()
    } else {
      startRecognition()
    }
  }

  return (
    <div className="absolute right-0 top-0 bottom-0 items-center flex">
      <TooltipWrapper
        html={
          settings.useSpeechRecognition
            ? 'Disable speech recognition'
            : 'Enable speech recognition (make sure you focus on the input and your mic is working)'
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
      <TooltipWrapper html={inputModeHtml(settings.inputMode)} place="top">
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
