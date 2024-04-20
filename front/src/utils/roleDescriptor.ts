export interface Role {
  roleDescriptor: string
  rightsDescription: string
}

export interface Roles {
  admin: Role
  moderator: Role
  user: Role
}

export const roles: { [ key: string ]: Role } = {
  admin: {
    roleDescriptor: 'администратор',
    rightsDescription: 'Управление пользователями, полный доступ к проектам и статьям.'
  },
  moderator: {
    roleDescriptor: 'модератор',
    rightsDescription: 'Модерация контента.'
  },
  user: {
    roleDescriptor: 'наблюдатель',
    rightsDescription: 'Просмотр контента, без возможности внесения изменений.'
  }
}
