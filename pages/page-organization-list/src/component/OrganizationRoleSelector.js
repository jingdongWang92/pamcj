import React from 'react';
import * as organizationRoles from '@jcmap/constant-organization-roles';
import Select from 'antd/es/select';


const roles = Array
  .from(Object.values(organizationRoles))
  .filter(role => role.invitable)
  .filter(role => !role.deprecated);


export default function OrganizationRoleSelector({ input }) {
  return (
    <Select {...input}>
      {roles.map(role => (
        <Select.Option key={role.code} value={role.code}>{role.name}</Select.Option>
      ))}
    </Select>
  );
}
