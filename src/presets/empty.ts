import { PresetType } from './types'

export const empty: PresetType = {
  id: 2,
  name: 'Empty',
  description: 'Has no categories and words.',
  data: { words: [], categories: [] }
}
