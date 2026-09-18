export const IPC_CHANNELS = {
  sessions: {
    list: 'sessions:list',
    get: 'sessions:get',
    create: 'sessions:create',
    update: 'sessions:update',
    delete: 'sessions:delete',
    clear: 'sessions:clear',
  },
  solves: {
    list: 'solves:list',
    create: 'solves:create',
    update: 'solves:update',
    delete: 'solves:delete',
  },
  stats: {
    getByPuzzle: 'stats:puzzle',
  },
} as const
