import Content from './about.mdx'
import { renderToString } from 'react-dom/server'
import { MDXProvider } from '@mdx-js/react'
import { Link } from 'react-router-dom'
import { Button, Text } from 'components'

const getHeadings = (source: string) => {
  const regex = /<h2>(.*?)<\/h2>/g

  const matched = source.match(regex)

  if (!matched) return []

  return matched.map((heading) => {
    const headingText = heading.replace('<h2>', '').replace('</h2>', '')

    const link = '#' + headingText.replace(/ /g, '_').toLowerCase()

    return {
      text: headingText,
      link
    }
  })
}

const TableOfContents = ({
  children
}: {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>
}) => {
  const contentString = renderToString(children)

  const headings = getHeadings(contentString)

  return (
    <div className="fixed top-32 right-[max(0px,calc(50%-34rem))]">
      {headings.length > 0 ? (
        <div>
          {headings.map((heading) => (
            <Link
              to={heading.link}
              key={heading.text}
              className="block py-1 group"
            >
              <Text
                color="gray-light"
                className="w-full text-left group-hover:text-primary-500"
              >
                {heading.text}
              </Text>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export const AboutPage = () => {
  return (
    <div className="relative">
      <div className="max-w-screen-sm mx-auto mb-32 space-y-4">
        <article className="prose prose-lg dark:prose-invert prose-slate">
          <Content />
        </article>
      </div>
      <TableOfContents>
        <Content />
      </TableOfContents>
    </div>
  )
}
