import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import z from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import { Role } from './roles'
import { workspaceSubject } from './subjects/workspace'

const appAbilitiesSchema = z.union([
  workspaceSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

export type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}

export const getUserPermission = (userId: string, role: Role) => {
  const authUser: User = {
    id: userId,
    role,
  }

  const ability = defineAbilityFor(authUser)

  return ability
}
