'use strict';

const sequelize = require('@jcmap/db-sequelize')(process.env.MYSQL_URI);


const Order = sequelize.model('order');
const Organization = sequelize.model('organization');
const Plan = sequelize.model('plan');
const number = require('lodash/number');
const moment = require('moment');

exports.searchOrders = searchOrders;
exports.fetchOrder = fetchOrder;
exports.updateOrder = updateOrder;
exports.removeOrder = removeOrder;
exports.createOrder = createOrder;

function createOrder() {
  return async function createOrder(ctx) {
    const organization = ctx.request.body.organization_id
      ? await Organization.findById(ctx.request.body.organization_id)
      : await Organization.findOne({
        where: {
          owner_id: ctx.state.user.id,
          personal: true,
        },
      });

    ctx.assert(ctx.request.body.plan_id, 404, 'plan is required');
    const plan = await Plan.findById(ctx.request.body.plan_id);
    ctx.assert(plan, 400, 'plan not found');

    const order = await Order.create(Object.assign({}, ctx.request.body, {
      user_id: ctx.state.user.id,
      plan_id: plan.id,
      organization_id: organization.id,
      merchandise_name: plan.name,
      trade_amount: plan.price,
      trade_no: genernateOrderNo(),
    }));

    ctx.body = {
      payload: order,
    };
  };
}

function searchOrders() {
  return async function (ctx) {
    const { rows: orders, count: total } = await Order.findAndCountAll({
      limit: ctx.request.query.limit,
      offset: ctx.request.query.skip,
      order: [
        ['id', 'DESC'],
      ],
      where: {
        user_id: ctx.state.user.id,
      },
    });
    ctx.body = {
      error: false,
      payload: orders,
      meta: { total },
    };
  };
}

function fetchOrder() {
  return async function (ctx, orderId) {
    const order = await Order.findOne({
      where: {
        id: orderId,
        user_id: ctx.state.user.id,
      },
    });
    ctx.assert(order, 404, 'no Order found');


    ctx.body = {
      error: false,
      payload: order,
    };
  };
}

function updateOrder() {
  return async function (ctx, orderId) {
    const order = await Order.findById(orderId);
    ctx.assert(order, 404, 'no Order found');

    await order.update(ctx.request.body);

    ctx.body = {
      error: false,
      payload: order,
    };
  };
}

function removeOrder() {
  return async function (ctx, orderId) {
    const order = await Order.findById(orderId);
    ctx.assert(order, 404, 'no Order found');

    await order.destroy();
    ctx.status = 204;
  };
}

function genernateOrderNo() {
  const time = moment().format('YYMMDDHHmmss');
  const random = number.random(1000,9999);
  return "1" + time + random;
}
