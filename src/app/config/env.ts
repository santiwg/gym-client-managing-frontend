export const config = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 10000,
  },
  urls: {
    // Autenticación
    auth: {
      login: '/users/login',
      register: '/users/register',
      refresh: '/users/refresh-token',
      me: '/users/me',
      canDo: '/users/can-do'
    },
    // Clientes
    clients: '/client',
    // Membresías
    memberships: '/membership',
    // Roles y permisos
    roles: '/roles',
    permissions: '/permissions',
    // Datos comunes
    states: '/state',
    genders: '/gender',
    bloodTypes: '/blood-type',
    clientGoals: '/client-goals',
  },
};