exports.OWNER = {
  name: '所有者',
  code: 'owner',
};

// deprecated, 使用`ADMINISTRATOR`替代
exports.ADMIN = {
  name: '管理员',
  code: 'admin',
  invitable: true,
  deprecated: true,
};

exports.ADMINISTRATOR = {
  name: '管理员',
  code: 'administrator',
  invitable: true,
};

exports.MEMBER = {
  name: '成员',
  code: 'member',
  invitable: true,
};
