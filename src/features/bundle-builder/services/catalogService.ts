import axios from 'axios'
import type { BundleCatalog } from '../types/bundle'

export async function getBundleCatalog() {
  const { data } = await axios.get<BundleCatalog>('/data/bundle.json')
  return data
}
