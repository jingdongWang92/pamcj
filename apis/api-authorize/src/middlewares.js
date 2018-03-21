const url = require('url');
const tokenUtils = require('@jcnetwork/token-utils');
const qs = require('qs');
const passwordUtils = require('@jcnetwork/password-utils');


exports.renderAuth = renderAuth;
exports.authDecision = authDecision;


function renderAuth(config) {
  const { sequelize } = config;
  const Client = sequelize.model('client');


  return async function (ctx) {
    const {
      client_id,
      access_key,
      redirect_uri,
      scope,
      state,
    } = ctx.request.query;
    const clientId = client_id || access_key;
    ctx.assert(clientId, 401, 'client_id is required');

    const client = await Client.findOne({
      where: {
        access_key: clientId,
      },
    });
    ctx.assert(client, 401, 'client does not exists');
    ctx.assert(client.redirect_uri === redirect_uri, 401, 'redirect_uri does not match');


    // TODO: 验证scope是否正确


    ctx.body = `
      <style>
        .form-control:focus {
          border-color: #66afe9;
          outline: 0;
          -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
          box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
        }
        .form-group {
          margin-top: 15px;
        }
        .form-control {
          width: 100%;
          height: 38px;
          padding: 6px 12px;
          font-size: 16px;
          background-color: #fff;
          background-image: none;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .btn {
          display: inline-block;
          margin-bottom: 0;
          font-weight: normal;
          text-align: center;
          background-image: none;
          border: 1px solid transparent;
          padding: 6px 12px;
          font-size: 16px;
          border-radius: 4px;
        }
        .btn-success {
          color: #fff;
          background-color: #5cb85c;
          border-color: #4cae4c;
        }
      </style>
      <div style="text-align:center;margin-top:80px;">
        <div>
          <h2>甲虫网络PaaS平台授权登录</h2>
        </div>
        <div style="display: flex;">
          <div style="flex: 1">
            应用 ${client.name} 请求授予以下权限
            <ol>
              <li>读取账户个人信息</li>
              ${scope.split(' ').map(permission => {
                return `
                  <li>${permission}</li>
                `;
              }).join('')}
            </ol>
          </div>
          <div style="flex: 1">
            <form method="post">
              <input type="hidden" name="client_id" value="${clientId}" />
              <input type="hidden" name="state" value="${state || ''}" />
              <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
              <div class="form-group">
                <input class="form-control" type="text" name="username" style="width:268px; height:38px" placeholder="username" /
              </div>
              <div class="form-group">
                <input class="form-control" type="password" name="password" style="width:268px;height:38px" placeholder="password" />
              </div>
              <div class="form-group">
                <button class="btn btn-success" type="submit" style="width:268px;height:40px">授权并登陆</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  };
}


function authDecision(config) {
  const { sequelize } = config;
  const User = sequelize.model('user');
  const AuthorizationCode = sequelize.model('authorization_code');


  return async function (ctx) {
    const { username, password } = ctx.request.body;
    const condition = {
      email: username,
      disabled_at: null,
    };
    const user = await User.findOne(condition).exec();
    ctx.assert(user, 401, '帐号或密码错误');
    const isPasswordMatch = await passwordUtils.comparePassword(password, user.password);
    ctx.assert(isPasswordMatch, 401, '帐号或密码错误');

    const redirectUri = global.decodeURIComponent(ctx.request.query.redirect_uri || ctx.request.body.redirect_uri);

    const responseType = ctx.request.query.response_type || ctx.request.body.response_type;


    if (responseType === 'token') {
      const token = await tokenUtils(user);
      const origUrlObj = url.parse(redirectUri);
      let newQuery = Object.assign({}, qs.parse((origUrlObj.search || '').slice(1)), token);

      const state = ctx.request.query.state || ctx.request.body.state;
      if (state) {
        newQuery = Object.assign(newQuery, { state });
      }

      const callback = url.format(Object.assign({}, origUrlObj, {
        search: `?${qs.stringify(newQuery)}`,
      }));
      return this.redirect(callback);
    }

    // TODO: should replace with random chars
    const code = 'woeruweoru';
    const authorizationCode = new AuthorizationCode(Object.assign({}, ctx.request.body, {
      code,
      user: user._id,
      redirect_uri: redirectUri,
    }));
    await authorizationCode.save();
    const callback = url.format(Object.assign({}, url.parse(redirectUri), {
      search: `?${Object.assign({}, qs.parse(redirectUri), {
        code,
      })}`,
    }));
    this.redirect(callback);
  };
}
