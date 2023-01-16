import { useStore, WordType } from 'store'
import { useParams } from 'react-router-dom'
import { WordEditor, PageContainer, useWordEditor } from 'components'
import { Button } from 'ui'
import { TooltipWrapper } from 'react-tooltip'
import { useWordNavigation } from './use-word-navigation'

export const WordPageCore = ({ word }: { word: WordType }) => {
  const wordEditor = useWordEditor({ length: 3 })
  const wordNav = useWordNavigation({ word })

  return (
    <PageContainer>
      <div data-test="word-editor">
        <WordEditor
          height={330}
          word={word}
          wordEditor={wordEditor}
          wordNav={wordNav}
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          {wordNav.prevWord && (
            <TooltipWrapper content="CTRL+Left">
              <Button
                color="gray"
                size="md"
                onClick={wordNav.goToPreviousWord}
                data-test="btn-prev-word"
              >
                {'Previous Word'}
              </Button>
            </TooltipWrapper>
          )}
        </div>
        <div>
          {wordNav.nextWord && (
            <TooltipWrapper content="CTRL+Right">
              <Button
                color="gray"
                size="md"
                onClick={wordNav.goToNextWord}
                data-test="btn-next-word"
              >
                {'Next Word'}
              </Button>
            </TooltipWrapper>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export const WordPage = () => {
  const wordId = useParams<{ id: string }>().id

  const word = useStore((state) =>
    wordId ? state.words.find((c) => c.id === +wordId) : null
  )

  if (!word) return null
  return <WordPageCore word={word} />
}
