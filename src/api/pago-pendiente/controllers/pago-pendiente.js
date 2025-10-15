'use strict';

/**
 * pago-pendiente controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::pago-pendiente.pago-pendiente', ({ strapi }) => ({
  
  /**
   * Guardar datos antes de ir a MercadoPago
   * POST /api/pagos-pendientes/guardar
   */
  async guardar(ctx) {
    try {
      const { external_reference, client_data, plan_data } = ctx.request.body;
      
      if (!external_reference || !client_data || !plan_data) {
        return ctx.badRequest('Faltan datos requeridos');
      }
      
      console.log('💾 Guardando pago pendiente:', {
        external_reference,
        client_name: client_data.nombre,
        plan_title: plan_data.title
      });
      
      // Verificar si ya existe
      const existing = await strapi.db.query('api::pago-pendiente.pago-pendiente').findOne({
        where: { external_reference }
      });
      
      if (existing) {
        console.log('⚠️ Ya existe, actualizando...');
        const updated = await strapi.db.query('api::pago-pendiente.pago-pendiente').update({
          where: { id: existing.id },
          data: {
            client_name: client_data.nombre,
            client_email: client_data.mail,
            client_phone: client_data.telefono,
            plan_id: plan_data.id,
            plan_title: plan_data.title,
            plan_price: plan_data.price,
            plan_description: plan_data.description || plan_data.highlight,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
          }
        });
        
        return ctx.send({
          success: true,
          message: 'Datos actualizados',
          data: updated
        });
      }
      
      // Crear nuevo registro
      const pagoPendiente = await strapi.db.query('api::pago-pendiente.pago-pendiente').create({
        data: {
          external_reference,
          client_name: client_data.nombre,
          client_email: client_data.mail,
          client_phone: client_data.telefono,
          plan_id: plan_data.id,
          plan_title: plan_data.title,
          plan_price: plan_data.price,
          plan_description: plan_data.description || plan_data.highlight,
          payment_status: 'pending',
          email_sent: false,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expira en 24 horas
        }
      });
      
      console.log('✅ Pago pendiente guardado:', pagoPendiente.id);
      
      return ctx.send({
        success: true,
        message: 'Datos guardados correctamente',
        data: pagoPendiente
      });
      
    } catch (error) {
      console.error('❌ Error guardando pago pendiente:', error);
      return ctx.internalServerError('Error guardando datos');
    }
  },
  
  /**
   * Recuperar datos por external_reference
   * GET /api/pagos-pendientes/recuperar/:reference
   */
  async recuperar(ctx) {
    try {
      const { reference } = ctx.params;
      
      if (!reference) {
        return ctx.badRequest('Se requiere external_reference');
      }
      
      console.log('🔍 Buscando pago pendiente:', reference);
      
      const pagoPendiente = await strapi.db.query('api::pago-pendiente.pago-pendiente').findOne({
        where: { external_reference: reference }
      });
      
      if (!pagoPendiente) {
        console.log('⚠️ No se encontró pago pendiente');
        return ctx.notFound('No se encontraron datos');
      }
      
      console.log('✅ Pago pendiente encontrado:', pagoPendiente.id);
      
      // Formatear respuesta
      return ctx.send({
        success: true,
        data: {
          clientData: {
            nombre: pagoPendiente.client_name,
            mail: pagoPendiente.client_email,
            telefono: pagoPendiente.client_phone
          },
          planData: {
            id: pagoPendiente.plan_id,
            title: pagoPendiente.plan_title,
            price: pagoPendiente.plan_price,
            description: pagoPendiente.plan_description
          },
          payment_status: pagoPendiente.payment_status,
          email_sent: pagoPendiente.email_sent
        }
      });
      
    } catch (error) {
      console.error('❌ Error recuperando pago pendiente:', error);
      return ctx.internalServerError('Error recuperando datos');
    }
  },
  
  /**
   * Actualizar estado después del pago
   * PUT /api/pagos-pendientes/actualizar-pago
   */
  async actualizarPago(ctx) {
    try {
      const { external_reference, payment_id, payment_status, merchant_order_id, email_sent } = ctx.request.body;
      
      if (!external_reference) {
        return ctx.badRequest('Se requiere external_reference');
      }
      
      console.log('🔄 Actualizando estado de pago:', external_reference);
      
      const pagoPendiente = await strapi.db.query('api::pago-pendiente.pago-pendiente').findOne({
        where: { external_reference }
      });
      
      if (!pagoPendiente) {
        return ctx.notFound('No se encontró el pago pendiente');
      }
      
      const updated = await strapi.db.query('api::pago-pendiente.pago-pendiente').update({
        where: { id: pagoPendiente.id },
        data: {
          payment_id,
          payment_status,
          merchant_order_id,
          email_sent: email_sent || false
        }
      });
      
      console.log('✅ Estado actualizado');
      
      return ctx.send({
        success: true,
        message: 'Estado actualizado correctamente',
        data: updated
      });
      
    } catch (error) {
      console.error('❌ Error actualizando pago:', error);
      return ctx.internalServerError('Error actualizando pago');
    }
  }
  
}));

