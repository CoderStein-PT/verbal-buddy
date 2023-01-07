import { Text, SeparatorFull } from 'components'

export const Explanation = () => {
  return (
    <div className="px-4">
      <Text variant="button" className="text-center">
        {'Guess'}
      </Text>
      <Text color="gray-light" className="text-center">
        {'Guess the words by looking at their descriptions! 🔥'}
      </Text>
      <SeparatorFull className="my-2" />
      <div>
        <ul className="pl-8 text-white list-disc">
          <li>
            <Text
              color="gray-light"
              dangerouslySetInnerHTML={{
                __html:
                  "You don't need to press Enter to check if the word is correct. If it is correct, it will be automatically submitted."
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
            <Text
              color="gray-light"
              dangerouslySetInnerHTML={{
                __html:
                  'The timer counts only the time you spend thinking about the words, not the time you spend typing them. The red dot indicates that the timer is paused.'
              }}
            />
          </li>
        </ul>
      </div>
    </div>
  )
}
