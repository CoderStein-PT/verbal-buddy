import Content from './about.mdx'
import { TableOfContents } from './table-of-contents'

export const AboutPage = () => {
  return (
    <div className="relative">
      <div className="max-w-screen-sm mx-auto space-y-4">
        <article className="pb-32 prose prose-lg dark:prose-invert prose-slate">
          <Content />
        </article>
      </div>
      <TableOfContents>
        <Content />
      </TableOfContents>
    </div>
  )
}
