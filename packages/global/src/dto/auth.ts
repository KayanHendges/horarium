import { User } from '@repo/db'
import z from 'zod'

export const nameSchema = z.string().min(2).trim()
export const emailSchema = z.string().email().trim()
export const passwordSchema = z.string().min(8).max(64)

export const loginUserDTO = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type LoginUserDTO = z.infer<typeof loginUserDTO>

export const registerUserDTO = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export interface LoginUserResponse {
  accessToken: string
}

export type RegisterUserDTO = z.infer<typeof registerUserDTO>

export interface RegisterUserResponse extends User {}

export const requestPasswordRecoverySchema = z.object({
  email: emailSchema,
})

export type RequestPasswordRecoveryDTO = z.infer<
  typeof requestPasswordRecoverySchema
>

export const resetPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  code: z
    .string()
    .min(6)
    .max(6)
    .regex(/\d.*/g, { message: 'Only number are allowed.' }),
})

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>
