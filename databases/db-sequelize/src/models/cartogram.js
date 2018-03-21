const commonModelFields = require('../common_model_fields');


module.exports = (sequelize, DataTypes) => {
  const { INTEGER, STRING, GEOMETRY, DOUBLE } = DataTypes;

  return sequelize.define('cartogram', {
    ...commonModelFields,
    owner_id: {
      type: INTEGER,
      get() {
        const value = this.getDataValue('owner_id');
        return value == null ? value : value.toString();
      },
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    location: {
      type: GEOMETRY('POINT'),
    },
    length: {
      type: DOUBLE,
      defaultValue: 0,
    },
    width: {
      type: DOUBLE,
      defaultValue: 0,
    },
    height: {
      type: DOUBLE,
      defaultValue: 0,
    },
    address: {
      type: STRING,
    },
    floor_label: { // 楼层在电梯按键上的编号
      type: STRING,
    },
    floor_index: { // 楼层从地基开始的编号
      type: INTEGER,
    },
    floor_number: { // 语义上的楼层，比如 -2F 就是 -2
      type: INTEGER,
    },
    diagram: { // 建筑蓝图
      type: STRING,
    },
    formated_diagram: { // 人工处理之后符合甲虫室内地图规范的建筑图（俗称底图）
      type: STRING,
    },
  });
};
