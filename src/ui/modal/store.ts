import create from 'zustand'

export type ModalDataType = {
  title: string
  description: string | JSX.Element
  okText: string
  cancelText: string
  onOkClick: () => boolean | void
  onCancelClick: () => boolean | void
  slideId: number
  closeIcon: boolean
  show: boolean
  hideCard: boolean
  isOkLoading: boolean
}

export type ModalStoreState = {
  modal: ModalDataType
  setModal: (value: Partial<ModalDataType>) => any
  resetModal: () => any
  hideModal: () => any
}

const modalDefault = {
  show: false,
  title: '',
  description: '',
  okText: 'Ok',
  cancelText: 'Cancel',
  closeIcon: false,
  slideId: 0,
  onOkClick: () => {},
  onCancelClick: () => {},
  hideCard: false,
  isOkLoading: false
}

export const useModalStore = create<ModalStoreState>(
  (set: (fn: (state: ModalStoreState) => any) => void) => ({
    modal: modalDefault,
    setModal: (value) =>
      set((state) => ({ modal: { ...state.modal, ...value } })),
    resetModal: () => set((_state) => ({ modal: modalDefault })),
    hideModal: () =>
      set((_state) => ({ modal: { ..._state.modal, show: false } }))
  })
)
