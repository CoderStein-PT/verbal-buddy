import { FaQuestionCircle } from '@react-icons/all-files/fa/FaQuestionCircle'
import { TooltipWrapper } from 'react-tooltip'
import { useModalStore, ModalBase, Text } from 'ui'
import gifSelect from 'public/help-selecting.gif'
import gifEnter from 'public/help-enter.gif'
import gifRemoving from 'public/help-removing.gif'
import gifWordProps from 'public/help-word-props.gif'
import gifWordNav from 'public/help-word-nav.gif'
import gifGlobalNav from 'public/help-global-nav.gif'
import gifWordDeepNav from 'public/help-word-deep-nav.gif'
import gifFocusCommander from 'public/focus-commander.gif'

const SliderWithGif = ({
  description,
  gifSrc
}: {
  description: string
  gifSrc?: string
}) => (
  <div className="flex flex-col items-center gap-4">
    <Text
      color="gray-light"
      dangerouslySetInnerHTML={{ __html: description }}
    />
    {!!gifSrc && <img src={gifSrc} />}
  </div>
)

const helpSlides = [
  {
    title: 'Commander Shortcuts',
    description:
      'Learn keyboard shortcuts to navigate through the app and learn faster! 🔥'
  },
  {
    title: 'Focus on the commander',
    description:
      "Make sure you have the <span class='key-span'>Commander</span> focused. You can do this by clicking on it.",
    gifSrc: gifFocusCommander
  },
  {
    title: 'Navigate',
    description:
      "You can use the <span class='key-span'>Arrow Up</span> and <span class='key-span'>Arrow Down</span> keys to navigate through the list of items.",
    gifSrc: gifSelect
  },
  {
    title: 'Select items',
    description:
      "You can use the <span class='key-span'>Enter</span> key to select an item.",
    gifSrc: gifEnter
  },
  {
    title: 'Delete items',
    description:
      "You can use the <span class='key-span'>Backspace</span> or <span class='key-span'>Del</span> key to remove an item.",
    gifSrc: gifRemoving
  },
  {
    title: 'Navigate between words',
    description:
      "You can use the <span class='key-span'>Left</span> or <span class='key-span'>Right</span> keys to go to the previous or next word",
    gifSrc: gifWordNav
  },
  {
    title: 'Navigate word properties',
    description:
      "You can use the <span class='key-span'>Alt + Right</span> or <span class='key-span'>Alt + Left</span> keys to navigate different word properties.",
    gifSrc: gifWordProps
  },
  {
    title: "Navigate word's tree",
    description:
      "You can use the <span class='key-span'>Shift + Left</span> or <span class='key-span'>Shift + Right</span> keys to navigate in the word's tree.",
    gifSrc: gifWordDeepNav
  },
  {
    title: 'Navigate pages',
    description:
      "You can use the <span class='key-span'>Ctrl + Left</span> or <span class='key-span'>Ctrl + Right</span> keys to navigate between pages.",
    gifSrc: gifGlobalNav
  }
]

export const HelpIcon = ({ title }: { title: string }) => {
  const { modal, hideModal, setModal } = useModalStore((store) => store)

  const openCommanderHelp = () => {
    setModal({
      show: true,
      title: helpSlides[0].title,
      description: (
        <SliderWithGif
          description={helpSlides[0].description}
          gifSrc={helpSlides[0].gifSrc || undefined}
        />
      ),
      okText: 'Next',
      cancelText: 'Back',
      slideId: 0,
      onOkClick: () => {
        const prevSlideId = useModalStore.getState().modal.slideId

        if (prevSlideId === helpSlides.length - 1) {
          hideModal()
          return
        }

        const newSlideId = Math.min(
          helpSlides.length - 1,
          (prevSlideId || 0) + 1
        )

        setModal({
          slideId: newSlideId,
          title: helpSlides[newSlideId].title,
          description: (
            <SliderWithGif
              description={helpSlides[newSlideId].description}
              gifSrc={helpSlides[newSlideId].gifSrc || undefined}
            />
          ),
          okText: newSlideId === helpSlides.length - 1 ? 'Done' : 'Next'
        })
      },
      onCancelClick: () => {
        const prevSlideId = useModalStore.getState().modal.slideId
        const newSlideId = Math.max(0, (prevSlideId || 0) - 1)
        setModal({
          slideId: newSlideId,
          title: helpSlides[newSlideId].title,
          description: (
            <SliderWithGif
              description={helpSlides[newSlideId].description}
              gifSrc={helpSlides[newSlideId].gifSrc}
            />
          )
        })
      }
    })
  }

  return (
    <div
      className="absolute z-[5] cursor-pointer top-2 left-2 group"
      onClick={openCommanderHelp}
    >
      <ModalBase modal={modal} hideModal={hideModal} />
      <TooltipWrapper content={title} place="top">
        <FaQuestionCircle className="text-gray-500 transition group-hover:text-primary-500" />
      </TooltipWrapper>
    </div>
  )
}
