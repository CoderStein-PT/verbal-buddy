import Content from './about.mdx'

export const AboutPage = () => {
  return (
    <div className="max-w-screen-sm mx-auto mb-32 space-y-4">
      <article className="prose prose-lg dark:prose-invert prose-slate">
        <Content />
      </article>
    </div>
  )
}
