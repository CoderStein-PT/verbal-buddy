import { Button, Card, CardHeading, CardContent, Text, CardFooter } from 'ui'
import { Dialog } from '@headlessui/react'
import { ModalDataType } from './store'
import { RiCloseFill } from '@react-icons/all-files/ri/RiCloseFill'

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="absolute right-2 top-2">
      <Button
        color="gray"
        size="icon"
        onClick={() => {
          onClick()
        }}
      >
        <RiCloseFill />
      </Button>
    </div>
  )
}

const ModalCard = ({
  modal,
  onOkClick,
  onCancelClick,
  hideModal
}: {
  modal: ModalDataType
  onOkClick: () => void
  onCancelClick: () => void
  hideModal: () => void
}) => (
  <Card className="flex flex-col h-full w-96">
    <CardHeading>
      <Text variant="button">{modal.title}</Text>
    </CardHeading>
    <CardContent className="flex-1 overflow-y-auto">
      {typeof modal.description === 'string' ? (
        <Text className="mt-2">{modal.description}</Text>
      ) : (
        modal.description
      )}
    </CardContent>
    <CardFooter className="flex items-center justify-between gap-4">
      {modal.cancelText && (
        <Button color="gray" onClick={onCancelClick}>
          {modal.cancelText}
        </Button>
      )}
      {modal.okText && (
        <Button isLoading={modal.isOkLoading} onClick={onOkClick}>
          {modal.okText}
        </Button>
      )}
    </CardFooter>
    <CloseButton onClick={hideModal} />
  </Card>
)

export const ModalBase = ({
  modal,
  hideModal
}: {
  modal: ModalDataType
  hideModal: () => void
}) => {
  const onOkClick = async () => {
    const result = await modal.onOkClick()
    if (!result) return
    hideModal()
  }

  const onCancelClick = async () => {
    const result = await modal.onCancelClick()
    if (!result) return
    hideModal()
  }

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-10 flex items-center justify-center h-screen transition backdrop-blur-sm"
      onClose={onCancelClick}
      open={modal.show}
    >
      <div className="relative flex flex-col max-h-screen py-4">
        {modal.hideCard ? (
          modal.description
        ) : (
          <ModalCard
            modal={modal}
            onOkClick={onOkClick}
            onCancelClick={onCancelClick}
            hideModal={hideModal}
          />
        )}
      </div>
    </Dialog>
  )
}
