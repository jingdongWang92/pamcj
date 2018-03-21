const LEVEL_0 = exports.LEVEL_0 = 'level_0';
exports.LEVEL_1 = 'level_1';
exports.LEVEL_2 = 'level_2';
exports.LEVEL_3 = 'level_3';

// aliases
exports.LEVEL_TRIAL = process.env.LEVEL_TRIAL || LEVEL_0; // 默认为`LEVEL_0`, 支持通过环境变量覆盖默认值
