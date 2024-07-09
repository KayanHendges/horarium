import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  OWNER(_, { can }) {
    can('manage', 'all')
  },
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update'], 'Workspace')
    can(['transfer_ownership', 'update'], 'Workspace', {
      ownerId: { $eq: user.id },
    })
  },
  MEMBER() {},
}
