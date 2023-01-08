import { Text, SeparatorFull } from 'components'
import { CategoryType } from 'store'

export const Explanation = ({ category }: { category: CategoryType }) => {
  return (
    <div className="px-4">
      <Text color="gray-light" className="text-center">
        {
          'Type the words you remember from this category as fast as you can! 🔥'
        }
      </Text>
      <SeparatorFull className="my-2" />
      <div>
        <ul className="pl-8 text-white list-disc">
          <li>
            <Text
              color="gray-light"
              dangerouslySetInnerHTML={{
                __html:
                  'After typing each word press <b>Enter</b> to add it to the list.'
              }}
            />
          </li>
          <li>
            <Text
              color="gray-light"
              dangerouslySetInnerHTML={{
                __html:
                  "You'll see the stats on the right after you guess all the words. Avg is the most important metric as it shows how much time you think between each word on average. Your goal is to improve it over time."
              }}
            />
          </li>
          <li>
            <Text color="gray-light">
              {
                'If you type a word that is not in this category, it will appear as red (mistake) in the list.'
              }
            </Text>
          </li>
          <li>
            <Text
              color="gray-light"
              dangerouslySetInnerHTML={{
                __html:
                  'The timer counts only the time you spend thinking about the words, not the time you spend typing them. The red dot indicates that the timer is paused.'
              }}
            />
          </li>
          <li>
            <Text
              color="gray-light"
              dangerouslySetInnerHTML={{
                __html:
                  "If you think the word you typed is correct, but it's not in the list, you can hover over it and click the <b>+</b> button to add it to the list. Also you can correct it by clicking the 'edit' button."
              }}
            />
          </li>
        </ul>
      </div>
    </div>
  )
}
