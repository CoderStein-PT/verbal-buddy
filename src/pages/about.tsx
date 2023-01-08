import Content from './about.mdx'

export const AboutPage = () => {
  return (
    <div className="max-w-screen-sm mx-auto mb-32 space-y-4">
      <article className="prose prose-lg dark:prose-invert prose-slate prose-li:leading-normal prose-headings:font-title prose-li:my-2 prose-headings:text-slate-200 prose-p:text-slate-400 prose-li:text-slate-400">
        <Content />
      </article>
    </div>
  )
}
