export const IPC_CHANNELS = {
  sessions: {
    list: 'sessions:list',
    get: 'sessions:get',
    create: 'sessions:create',
    update: 'sessions:update',
    delete: 'sessions:delete',
  },
  solves: {
    list: 'solves:list',
    create: 'solves:create',
    update: 'solves:update',
    delete: 'solves:delete',
  },
} as const
