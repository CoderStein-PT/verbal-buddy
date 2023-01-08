import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const mdx = await import('@mdx-js/rollup')

  return {
    optimizeDeps: {
      include: ['react/jsx-runtime']
    },
    plugins: [react(), tsconfigPaths(), mdx.default({ remarkPlugins: [] })],
    server: {
      port: 3000
    }
  }
})
