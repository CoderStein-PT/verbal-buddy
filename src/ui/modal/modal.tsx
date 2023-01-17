import { ModalBase } from './modal-base'
import { useModalStore } from './store'

export const Modal = () => {
  const { modal, hideModal } = useModalStore((store) => store)

  return <ModalBase modal={modal} hideModal={hideModal} />
}
