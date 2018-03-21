const commonModelFields = require('../common_model_fields');
const tinycolor2 = require('tinycolor2');
const get = require('lodash/fp/get');
const isString = require('lodash/fp/isString');
const isNil = require('lodash/fp/isNil');
const {
  TYPE_POINT,
  TYPE_CURVE,
  TYPE_SURFACE,
  TYPE_FILL,
  TYPE_STROKE,
  TYPE_SIZE,
  TYPE_OPACITY,
  TYPE_ROTATION,
  TYPE_ANCHOR_POINT,
  TYPE_DISPLACEMENT,
  TYPE_GRAPHIC,
  TYPE_EXTERNAL_GRAPHIC,
  TYPE_MARK,
} = require('@jcmap/constant-style-types');

module.exports = (sequelize, DataTypes) => {
  const { TEXT, ENUM } = DataTypes;

  return sequelize.define('geometry_style', {
    ...commonModelFields,
    geometry_type: {
      type: ENUM('Point', 'Curve', 'Surface'),
      allowNull: false,
    },
    style: {
      type: TEXT,
      defaultValue: JSON.stringify({}),
      allowNull: false,
      set(value) {
        this.setDataValue('style', JSON.stringify(value));
      },
      get() {
        return JSON.parse(this.getDataValue('style'));
      },
      validate: {
        isValidStyles(styleValue) { // JSON string
          if (!styleValue) {
            throw new Error('style should be an object');
          }

          const style = JSON.parse(styleValue);
          const { type } = style;

          if (type === TYPE_POINT) {
            pointStyleValidator(style);
          } else  if (type === TYPE_CURVE) {
            curveStyleValidator(style);
          } else if (type === TYPE_SURFACE) {
            surfaceStyleValidator(style);
          } else {
            throw new Error(`invalid style with type ${type}`);
          }
        },
      },
    },
  });
};


// {
//   type: TYPE_POINT,
//   graphic: {},
//   opacity: {},
//   size: {},
//   rotation: {},
//   anchor_point: {},
//   displacement: {},
// }
function pointStyleValidator(style) {
  if (!isNil(style)) {
    const prefix = TYPE_POINT;

    graphicValidator(style.graphic, prefix);
    opacityValidator(style.opacity, prefix);
    sizeValidator(style.size, prefix);
    rotationValidator(style.rotation, prefix);
    anchorPointValidator(style.anchor_point, prefix);
    displacementValidator(style.displacement, prefix);
  }
}


// {
//   type: TYPE_CURVE,
//   stroke: {},
// }
function curveStyleValidator(style) {
  if (!isNil(style)) {
    const prefix = TYPE_CURVE;

    strokeValidator(style.stroke, prefix);
  }
}


// {
//   type: TYPE_SURFACE,
//   fill: {},
//   stroke: {},
// }
function surfaceStyleValidator(style) {
  if (!isNil(style)) {
    const prefix = TYPE_SURFACE;

    fillValidator(style.fill, prefix);
    strokeValidator(style.stroke, prefix);
  }
}


// {
//   type: TYPE_STROKE,
//   color: '#fff',
//   width: 3,
// }
function strokeValidator(stroke, prefix='') {
  if (!isNil(stroke)) {
    const _prefix = `${prefix}:${TYPE_STROKE}`;

    if (stroke.type !== TYPE_STROKE) {
      throw new Error(`${_prefix}: invalid fill type`);
    }

    if (!tinycolor2(stroke.color).isValid()) {
      throw new Error(`${_prefix}: invalid stroke color`);
    }

    if (!Number.isFinite(stroke.width) || stroke.width <= 0) {
      throw new Error(`${_prefix}: invalid stroke width`);
    }
  }
}


// {
//   type: TYPE_FILL,
//   color: '#fff',
// }
function fillValidator(fill, prefix='') {
  if (!isNil(fill)) {
    const _prefix = `${prefix}:${TYPE_FILL}`;

    if (fill.type !== TYPE_FILL) {
      throw new Error(`${_prefix}: invalid fill type`);
    }

    if (!tinycolor2(fill.color).isValid()) {
      throw new Error(`${_prefix}: invalid fill color`);
    }
  }
}


// {
//   type: TYPE_DISPLACEMENT,
//   x: 0,
//   y:: 0
// }
function displacementValidator(displacement, prefix='') {
  if (!isNil(displacement)) {
    const _prefix = `${prefix}:${TYPE_DISPLACEMENT}`;

    if (displacement.type !== TYPE_DISPLACEMENT) {
      throw new Error(`${_prefix}: invalid displacement type`);
    }

    if (!Number.isFinite(displacement.x)) {
      throw new Error(`${_prefix}: invalid displacement x`);
    }

    if (!Number.isFinite(displacement.y)) {
      throw new Error(`${_prefix}: invalid displacement y`);
    }
  }
}


// {
//   type: 'graphic',
//   value: {ExternalGraphic || Mark}
// }
function graphicValidator(style, prefix = '') {
  if (!isNil(style)) {
    const _prefix = `${prefix}:${TYPE_GRAPHIC}`;

    if (style.type !== TYPE_GRAPHIC) {
      throw new Error(`${_prefix}: invalid graphic type`);
    }

    if (get('value.type', style) === TYPE_EXTERNAL_GRAPHIC) {
      externalGraphicValidator(style.value, _prefix);
    } else if (get('value.type', style) === TYPE_MARK) {
      markValidator(style.value, _prefix);
    } else {
      throw new Error(`${_prefix}: invalid graphic value`);
    }
  }
}


// {
//   type: TYPE_MARK,
//   fill: {},
//   stroke: {}
// }
function markValidator(mark, prefix='') {
  if (!isNil(mark)) {
    const _prefix = `${prefix}:${TYPE_MARK}`;

    fillValidator(mark.fill, _prefix);
    strokeValidator(mark.stroke, _prefix);
  }
}


// {
//   type: TYPE_SIZE,
//   value: 0
// }
function sizeValidator(size, prefix='') {
  if (!isNil(size)) {
    const _prefix = `${prefix}:${TYPE_SIZE}`;

    if (size.type !== TYPE_SIZE) {
      throw new Error(`${_prefix}: invalid size`);
    }

    if (!Number.isFinite(size.value) || size.value < 1) {
      throw new Error(`${_prefix}: invalid size value`);
    }
  }
}


// {
//   type: TYPE_OPACITY,
//   value: 0.7
// }
function opacityValidator(opacity, prefix='') {
  if (!isNil(opacity)) {
    const _prefix = `${prefix}:${TYPE_OPACITY}`;

    if (opacity.type !== TYPE_OPACITY) {
      throw new Error(`${_prefix}: invalid fill type`);
    }

    if (!Number.isFinite(opacity.value) || opacity.value < 0 || opacity.value > 1) {
      throw new Error(`${_prefix}: invalid opacity value`);
    }
  }
}


// {
//   type: TYPE_ROTATION,
//   value: 273
// }
function rotationValidator(rotation, prefix='') {
  if (!isNil(rotation)) {
    const _prefix = `${prefix}:${TYPE_ROTATION}`;

    if (!Number.isFinite(rotation.value)) {
      throw new Error(`${_prefix}: invalid rotation value`);
    }
  }
}


// {
//   type: TYPE_ANCHOR_POINT,
//   x: 0,
//   y: 0
// }
function anchorPointValidator(anchorPoint, prefix='') {
  if (!isNil(anchorPoint)) {
    const _prefix = `${prefix}:${TYPE_ANCHOR_POINT}`;

    if (!Number.isFinite(anchorPoint.x)) {
      throw new Error(`${_prefix}: invalid anchor point x`);
    }

    if (!Number.isFinite(anchorPoint.y)) {
      throw new Error(`${_prefix}: invalid anchor point y`);
    }
  }
}


// {
//   type: TYPE_EXTERNAL_GRAPHIC,
//   link: 'example/path/to/icon'
// }
function externalGraphicValidator(externalGraphic, prefix='') {
  if (!isNil(externalGraphic)) {
    const _prefix = `${prefix}:${TYPE_EXTERNAL_GRAPHIC}`;

    if (externalGraphic.type !== TYPE_EXTERNAL_GRAPHIC) {
      throw new Error(`${_prefix}: invalid external graphic type`);
    }

    if (!isNil(externalGraphic.link) && !isString(externalGraphic.link)) {
      throw new Error(`${_prefix}: invalid external graphic link`);
    }
  }
}
