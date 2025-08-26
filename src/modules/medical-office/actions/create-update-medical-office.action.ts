import { bodegaApi } from '@/api/medicalOfficeApi'
import type { ChainCustody } from '../interfaces/chain-custody.interface'

export const createUpdateChainCustodyAction = async (chainCusody: Partial<ChainCustody>) => {
  try {
    if (chainCusody.id && chainCusody.id !== '') {
      return await updateChainCusody(chainCusody)
    }
  } catch (error) {}
}

const updateChainCusody = async (chainCustody: Partial<ChainCustody>) => {
  const chainCustodyId = chainCustody.id
  delete chainCustody.id
  // TODO: delete user_id
  // delete chainCustody.user_id;
  delete chainCustody.created_at
  delete chainCustody.updated_at

  try {
    const { data } = await bodegaApi.patch<ChainCustody>(`/chains/${chainCustodyId}`, chainCustody)

    return data
  } catch (error) {
    console.log(error)
    throw new Error('Error updating chain custody')
  }
}
