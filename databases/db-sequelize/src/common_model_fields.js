const { INTEGER } = require('sequelize');


module.exports = {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get() {
      return `${this.getDataValue('id')}`;
    },
  },
};
