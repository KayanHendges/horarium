import { ResponseAPI } from ".";

export const handleAPIResponse = async<T>(response: Promise<ResponseAPI<T>>): Promise<T> => {
  const {data} =  await response
  return data
}