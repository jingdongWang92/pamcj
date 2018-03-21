/* eslint-disable no-unused-vars */
const Sequelize = require('sequelize');


module.exports = uri => {
  const sequelize = new Sequelize(uri, {
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    operatorsAliases: false,
    define: {
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
    },
  });


  const AccessToken = sequelize.import('access_token', require('./models/access-token'));
  const AuthorizationCode = sequelize.import('authorization_code', require('./models/authorization-code'));
  const AuthZhubajie = sequelize.import('auth_zhubajie', require('./models/auth-zhubajie'));
  const CartogramCollectionRelation = sequelize.import('cartogram_collection_relation', require('./models/cartogram-collection-relation'));
  const CartogramCollection = sequelize.import('cartogram_collection', require('./models/cartogram-collection'));
  const CartogramGeoreference = sequelize.import('cartogram_georeference', require('./models/cartogram-georeference'));
  const CartogramRoute = sequelize.import('cartogram_route', require('./models/cartogram-route'));
  const Cartogram = sequelize.import('cartogram', require('./models/cartogram'));
  const Client = sequelize.import('client', require('./models/client'));
  const DeviceType = sequelize.import('device_type', require('./models/device-type'));
  const Device = sequelize.import('device', require('./models/device'));
  const DumbBeaconDevice = sequelize.import('dumb_beacon_device', require('./models/dumb-beacon-device'));
  const FeatureField = sequelize.import('feature_field', require('./models/feature-field'));
  const FeatureProperty = sequelize.import('feature_property', require('./models/feature-property'));
  const Feature = sequelize.import('feature', require('./models/feature'));
  const GeometryStyle = sequelize.import('geometry_style', require('./models/geometry-style'));
  const Invoice = sequelize.import('invoice', require('./models/invoice'));
  const LayerFieldOption = sequelize.import('layer_field_option', require('./models/layer-field-option'));
  const LayerField = sequelize.import('layer_field', require('./models/layer-field'));
  const Layer = sequelize.import('layer', require('./models/layer'));
  const Order = sequelize.import('order', require('./models/order'));
  const OrganizationInvitation = sequelize.import('organization_invitation', require('./models/organization-invitation'));
  const OrganizationMember = sequelize.import('organization_member', require('./models/organization-member'));
  const Organization = sequelize.import('organization', require('./models/organization'));
  const PlanOrder = sequelize.import('plan_order', require('./models/plan-order'));
  const Plan = sequelize.import('plan', require('./models/plan'));
  const RefreshToken = sequelize.import('refresh_token', require('./models/refresh-token'));
  const User = sequelize.import('user', require('./models/user'));

  // AccessToken
  AccessToken.belongsTo(User);
  AccessToken.belongsTo(Client);


  // Organization
  Organization.belongsToMany(User, {
    as: 'members',
    through: OrganizationMember,
  });
  Organization.belongsTo(User, {
    as: 'owner',
    foreignKey: 'owner_id',
  });
  Organization.belongsTo(Plan);
  Organization.hasMany(OrganizationInvitation);
  OrganizationInvitation.belongsTo(Organization);


  // Cartogram
  Cartogram.belongsTo(Organization, {
    as: 'owner',
  });
  Cartogram.belongsToMany(CartogramCollection, {
    as: 'part_of',
    through: {
      model: CartogramCollectionRelation,
      unique: false,
    },
  });
  Cartogram.hasOne(CartogramGeoreference, {
    as: 'georeference',
    foreignKey: 'cartogram_id',
  });
  Cartogram.hasMany(Feature);


  //CartogramCollection
  CartogramCollection.belongsTo(Organization, {
    as: 'owner',
  });
  CartogramCollection.belongsToMany(Cartogram, {
    as: 'cartograms',
    through: {
      model: CartogramCollectionRelation,
      unique: false,
    },
  });
  CartogramCollection.hasMany(CartogramRoute, {
    as: 'routes',
  });

  // CartogramRoute
  CartogramRoute.belongsTo(CartogramCollection);
  CartogramRoute.belongsTo(Feature, {
    as: 'from_feature'
  });
  CartogramRoute.belongsTo(Feature, {
    as: 'to_feature'
  });

  // Client
  Client.belongsTo(User, {
    as: 'owner',
    foreignKey: 'owner_id',
  });

  // User
  User.belongsTo(Plan);
  User.hasMany(Organization, {
    as: 'owner',
    foreignKey: 'owner_id',
  });
  User.belongsToMany(Organization, {
    as: 'member_of',
    through: OrganizationMember,
  });
  User.hasMany(Order);
  User.hasMany(PlanOrder, {
    as: 'buyer',
    foreignKey: 'buyer_id',
  });
  User.hasMany(Invoice);


  // GeometryStyle
  GeometryStyle.hasMany(Layer, {
    foreignKey: 'geometry_style_id',
    as: 'geometry_style'
  });


  // Layer
  Layer.belongsTo(GeometryStyle, {
    foreignKey: 'geometry_style_id',
    as: 'geometry_style'
  });
  Layer.hasMany(LayerField, {
    as: 'fields',
  });
  Layer.belongsTo(Organization, {
    as: 'owner',
  });


  // LayerField
  LayerField.hasMany(LayerFieldOption, {
    as: 'options',
  });


  // Order
  Order.belongsTo(User);


  // PlanOrder
  PlanOrder.belongsTo(Order);
  PlanOrder.belongsTo(Organization, {
    as: 'buyer',
    foreignKey: 'buyer_id',
  });


  // Feature
  Feature.belongsTo(Organization, {
    as: 'owner',
  });
  Feature.belongsTo(Cartogram);
  Feature.belongsTo(Layer);
  Feature.belongsTo(GeometryStyle);
  Feature.hasMany(FeatureField, {
    as: 'fields',
  });
  Feature.hasMany(FeatureProperty, {
    as: 'properties',
  });


  CartogramGeoreference.belongsTo(Cartogram, {
    as: 'cartogram',
    foreignKey: 'cartogram_id',
  });

  // AuthZhubajie
  AuthZhubajie.belongsTo(User);


  return sequelize;
};
