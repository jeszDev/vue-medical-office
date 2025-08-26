import { bodegaApi } from '@/api/medicalOfficeApi'
import type { ChainCustody } from '../interfaces/chain-custody.interface'

export const getChainCustodyByIdAction = async (chainCustodyId: string): Promise<ChainCustody> => {
  if (chainCustodyId === 'create') {
    return {
      id: '',
      numero_unico_caso: '',
      folio: '',
      intervencion_lugar: '',
      intervencion_hora_fecha: '',
      motivo_registro: '',
      created_at: '',
      updated_at: '',
    }
  }

  try {
    console.log('Se va a realizar la peticion chain by id: ' + chainCustodyId)

    const { data } = await bodegaApi.get<ChainCustody>(`/chains/${chainCustodyId}`)

    console.log(data)

    return data
  } catch (error) {
    console.log(error)
    throw new Error(`Error getting chain by id ${chainCustodyId}`)
  }
}
