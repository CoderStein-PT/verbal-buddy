import { StoreType } from './../store'

export type PresetType = {
  id: number
  name: string
  description: string
  data: Pick<StoreType, 'categories' | 'words'>
}
