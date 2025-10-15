'use strict';

/**
 * pago-pendiente router
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/pagos-pendientes/guardar',
      handler: 'pago-pendiente.guardar',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/pagos-pendientes/recuperar/:reference',
      handler: 'pago-pendiente.recuperar',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/pagos-pendientes/actualizar-pago',
      handler: 'pago-pendiente.actualizarPago',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

