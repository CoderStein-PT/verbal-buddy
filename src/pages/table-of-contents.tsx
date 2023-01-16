import { renderToString } from 'react-dom/server'
import { Text } from 'ui'
import { useEffect, useState } from 'react'

const getHeadings = (source: string) => {
  const regex = /<h(2|3) id="(.*?)">(.*?)<\/h(2|3)>/g

  const matched = source.match(regex)

  if (!matched) return []

  return matched.map((heading) => {
    const headingText = heading
      .replace(/<h(2|3)(.*?)>/, '')
      .replace(/<\/h(2|3)>/, '')
    const id = heading.match(/id="(.*?)"/)?.[1]

    const level = heading.match(/<h(2|3)/)?.[1]

    return { text: headingText, id, level }
  })
}

export const TableOfContents = ({
  children
}: {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>
}) => {
  const contentString = renderToString(children)

  const headings = getHeadings(contentString)

  useEffect(() => {
    setTimeout(() => {
      const links = document.querySelectorAll('h2[id^="#"]')

      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault()

          const id = link.getAttribute('id')

          if (!id) return

          const target = document.getElementById(id.replace('#', ''))

          if (!target) return

          target.scrollIntoView({ behavior: 'smooth' })
        })
      })
    }, 1000)
  }, [])

  const [activeHeading, setActiveHeading] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      let activeHeading = null

      headings.forEach((heading) => {
        if (!heading.id) return

        const h = document.getElementById(heading.id)

        if (!h) return

        const elementPosition = h.getBoundingClientRect().top

        if (elementPosition <= 100) {
          activeHeading = heading.id
        }
      })

      setActiveHeading(activeHeading)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [headings])

  return (
    <div className="fixed top-32 right-[max(0px,calc(50%-34rem))] hidden md:block">
      {headings.length > 0 ? (
        <div>
          {headings.map((heading) => (
            <a
              href={'#' + heading.id}
              key={heading.text}
              className={`block py-1 group ${
                heading.level === '2' ? '' : 'pl-4'
              }`}
            >
              <Text
                color={activeHeading === heading.id ? 'primary' : 'gray-light'}
                className="w-full text-left group-hover:text-primary-500"
              >
                {heading.text}
              </Text>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}
