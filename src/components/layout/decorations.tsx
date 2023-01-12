import { useState } from 'react'
import { useRefs } from 'utils'
import { LinkGlow } from './navbar'

export const useDecoration = () => {
  const { refs, setRefFromKey } = useRefs()

  const [showBox, setShowBox] = useState(false)
  const [left, setLeft] = useState(0)
  const [scaleX, setScaleX] = useState(1)

  const onMouseEnter = (name: string) => {
    const target = refs[name]

    if (!target) return

    const left = target.offsetLeft
    const width = target.offsetWidth

    setScaleX(width / 100)
    setLeft(left)

    setShowBox(true)
  }

  const onMouseLeave = () => {
    setShowBox(false)
  }

  return {
    onMouseEnter,
    onMouseLeave,
    setRefFromKey,
    showBox,
    left,
    scaleX,
    setShowBox,
    setLeft,
    setScaleX
  }
}
type DecorationType = ReturnType<typeof useDecoration>
export const Decoration = ({ decoration }: { decoration: DecorationType }) => {
  const offset = decoration.showBox ? 0 : 200
  const left = decoration.left - offset
  const right = decoration.left + offset

  const leftTransform = `translateX(${left}px) scaleX(${decoration.scaleX})`
  const rightTransform = `translateX(${right}px) scaleX(${decoration.scaleX})`

  const opacity = decoration.showBox ? 1 : 0

  return (
    <>
      <LinkGlow
        className="bottom-0 left-0"
        style={{ transform: leftTransform, opacity }}
      />
      <LinkGlow
        className="top-0 left-0"
        style={{ transform: rightTransform, opacity }}
      />
    </>
  )
}
