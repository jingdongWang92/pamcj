const { pipe, lt, lte, lensPath, view, curry } = require('ramda');
const { set } = require('lodash');
const merge = require('lodash/fp/merge');


exports = module.exports = configRoute;
exports.formatAndValidPayloadWhenCreateAndUpdate = formatAndValidPayloadWhenCreateAndUpdate;
exports.createPlan = createPlan;
exports.searchPlans = searchPlans;
exports.fetchPlanByLevel = fetchPlanByLevel;
exports.fetchPlanById = fetchPlanById;
exports.updatePlan = updatePlan;
exports.markPlanAsLevelEnabled = markPlanAsLevelEnabled;
exports.removePlan = removePlan;
exports.orderPlan = orderPlan;


function configRoute(defaultRouteConfig={}) {
  return {
    formatAndValidPayloadWhenCreateAndUpdate: routeConfig => formatAndValidPayloadWhenCreateAndUpdate(merge(defaultRouteConfig, routeConfig)),
    createPlan: routeConfig => createPlan(merge(defaultRouteConfig, routeConfig)),
    searchPlans: routeConfig => searchPlans(merge(defaultRouteConfig, routeConfig)),
    fetchPlanByLevel: routeConfig => fetchPlanByLevel(merge(defaultRouteConfig, routeConfig)),
    fetchPlanById: routeConfig => fetchPlanById(merge(defaultRouteConfig, routeConfig)),
    updatePlan: routeConfig => updatePlan(merge(defaultRouteConfig, routeConfig)),
    markPlanAsLevelEnabled: routeConfig => markPlanAsLevelEnabled(merge(defaultRouteConfig, routeConfig)),
    removePlan: routeConfig => removePlan(merge(defaultRouteConfig, routeConfig)),
    orderPlan: routeConfig => orderPlan(merge(defaultRouteConfig, routeConfig)),
  };
}

function formatAndValidPayloadWhenCreateAndUpdate() {
  return async function createPlan(ctx, next) {
    ctx.assert(ctx.request.body.name, 400, 'name is required');
    ctx.assert(ctx.request.body.alias, 400, 'alias is required');


    const pricePath = ['request', 'body', 'price'];
    const rawPriceValue = view(lensPath(pricePath), ctx);
    ctx.assert(isTrueOrZero(rawPriceValue), 400, 'price is required');

    const price = toFixed(2, Number.parseFloat(rawPriceValue));
    ctx.assert(isNumberAndGreaterThanOrEqualToZero(price), 400, 'invalid price');
    set(ctx, pricePath, price);


    const mapMountPath = ['request', 'body', 'map_count'];
    const rawMapCountValue = view(lensPath(mapMountPath), ctx);
    ctx.assert(isTrueOrZero(rawMapCountValue), 400, 'map_count is required');

    const mapCount = Number.parseInt(rawMapCountValue, 10);
    ctx.assert(isNumberAndGreaterThanZero(mapCount), 400, 'invalid map_count');
    set(ctx, mapMountPath, mapCount);


    const projectCountPath = ['request', 'body', 'project_count'];
    const rawProjectCountValue = view(lensPath(projectCountPath), ctx);
    ctx.assert(isTrueOrZero(rawProjectCountValue), 400, 'project_count is required');

    const projectCount = Number.parseInt(rawProjectCountValue, 10);
    ctx.assert(isNumberAndGreaterThanZero(projectCount), 400, 'invalid project_count');
    set(ctx, projectCountPath, projectCount);

    await next();
  };
}

function createPlan(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Plan = sequelize.model('plan');

  return async function (ctx) {
    const plan = await Plan.create(ctx.request.body);

    ctx.body = {
      payload: plan,
    };
  };
}

function searchPlans(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Op = sequelize.Op;
  const Plan = sequelize.model('plan');

  return async function (ctx) {

    const condition = {};
    if(!ctx.user) {
      Object.assign(condition, {
        is_enabled: true,
        alias: {
          [Op.ne]: null,
        }
      })
    }

    const { rows: plans, count: total } = await Plan.findAndCountAll({
      limit: ctx.request.query.limit,
      offset: ctx.request.query.skip,
      where: condition,
    });


    ctx.body = {
      payload: plans,
      meta: { total },
    };
  };
}

function fetchPlanByLevel(routeConfig={}) {
  const { sequelize, planLevel } = routeConfig;
  const Plan = sequelize.model('plan');

  return async function (ctx) {
    const plan = await Plan.findOne({
      where: {
        level: planLevel,
        is_enabled: true,
        alias: '官网',
      },
      paranoid: false,
    });
    ctx.assert(plan, 404, 'no plan found');

    ctx.body = {
      payload: plan,
    };
  };
}

function fetchPlanById(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Plan = sequelize.model('plan');

  return async function (ctx, planId) {
    const plan = await Plan.findOne({
      where: {
        id: planId,
      },
      paranoid: false,
    });
    ctx.assert(plan, 404, 'no plan found');

    ctx.body = {
      payload: plan,
    };
  };
}

function updatePlan(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Plan = sequelize.model('plan');

  return async function (ctx, planId) {
    const plan = await Plan.find({
      where: {
        id: planId,
      },
    });
    ctx.assert(plan, 400, 'no plan found');

    await plan.update(ctx.request.body);

    ctx.body = {
      payload: plan,
    };
  };
}

function removePlan(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Plan = sequelize.model('plan');

  return async function (ctx, planId) {

    const plan = await Plan.findById(planId);
    ctx.assert(plan, 404, 'no plan found');
    ctx.assert(!plan.is_enabled && !plan.alias, 400, `不能删除${plan.level}默认方案`);

    await plan.destroy();

    ctx.status = 204;
  };
}

function markPlanAsLevelEnabled(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Plan = sequelize.model('plan');

  return async function (ctx, planId) {
    const plan = await Plan.findOne({
      where: {
        id: planId,
      },
    });
    ctx.assert(plan, 400, 'no plan found');

    const lastLevelEnabledPlan = await Plan.findOne({
      where: {
        level: plan.level,
        alias: plan.alias,
        is_enabled: true,
      },
    });

    try {
      const transaction = await sequelize.transaction();
      await plan.update({
        is_enabled: true,
        alias: lastLevelEnabledPlan ? lastLevelEnabledPlan.alias : plan.alias,
      }, { transaction });
      if (lastLevelEnabledPlan) {
        await lastLevelEnabledPlan.update({
          is_enabled: false,
          alias: null,
        }, { transaction });
      }
      transaction.commit();

      ctx.body = {
        payload: plan,
      };
    } catch (err) {
      ctx.throw(err);
    }
  };
}

function orderPlan(routeConfig={}) {
  const { sequelize } = routeConfig;
  const Plan = sequelize.model('plan');
  const PlanOrder = sequelize.model('plan_order');
  const Organization = sequelize.model('organization');
  const Order = sequelize.model('order');

  return async function (ctx, planId) {
    const plan = await Plan.findOne({
      where: {
        id: planId,
      },
    });
    ctx.assert(plan, 400, 'plan sold out');

    ctx.assert(ctx.request.body.organization_id, 400, '未指定购买者');

    const organization = await Organization.findOne({
      where: {
        id: ctx.request.body.organization_id,
      },
    });
    ctx.assert(organization, 400, '未查询到此购买者');


    const order = await Order.create({
      user_id: ctx.state.user.id,
      merchandise_name: plan.name,
      trade_amount: plan.price,
    });


    const planOrder = await PlanOrder.create({
      order_id: order.id,
      buyer_id: organization.id,
    });


    await planOrder.reload({
      include: [
        Order,
        {
          model: Organization,
          as: 'buyer',
        },
      ],
    });

    ctx.body = {
      payload: planOrder,
    };
  };
}

function isNumber(x) {
  return !Number.isNaN(x);
}

const isNumberAndGreaterThanZero = pipe(isNumber, lt(0));

const isNumberAndGreaterThanOrEqualToZero = pipe(isNumber, lte(0));

const isTrueOrZero = x => !!x || x === 0;

const toFixed = curry((s, x) => {
  return Number.parseInt(x * 10 ** s, 10) * 10 ** -s;
});
