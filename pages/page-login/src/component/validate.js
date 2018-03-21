const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = '用户名不能为空'
  }
  if (!values.password) {
    errors.password = '密码不能为空'
  }
  return errors
}

export default validate
