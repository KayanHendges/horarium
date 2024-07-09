import z from 'zod'

export const passwordDTO = z.string().min(8).max(64)

export const loginUserDTO = z.object({
  email: z.string().email(),
  password: passwordDTO,
})

export type LoginUserDTO = z.infer<typeof loginUserDTO>

export const registerUserDTO = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: passwordDTO,
})

export type RegisterUserDTO = z.infer<typeof registerUserDTO>

export interface ILoginResponse {
  accessToken: string
}
