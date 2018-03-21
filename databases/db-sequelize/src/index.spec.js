(async function () {
  try {
    const sequelize = require('.')('mysql://root:root@mariadb:3306/test');

    await sequelize.sync({force: true});
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(0);
  }
}());
