import React from 'react';
import PropTypes from 'prop-types';
import Menu from 'antd/es/menu';
import Icon from 'antd/es/icon';
import styled from 'styled-components';


export default class AppMenu extends React.Component {

  static contextTypes = {
    user: PropTypes.object,
    menus: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    siderCollapsed: PropTypes.bool.isRequired,
  }

  render() {
    if (!this.context.user) { return null; }

    const { user, menus, siderCollapsed } = this.context;
    const suitableMenus = menus.filter(menu => !(menu.role === 'immortal' && user.role !== menu.role));

    return (
      <StyledMenu mode="inline">
        {suitableMenus.map(menu => (
          <Menu.Item key={menu.id}>
            <Link href={menu.link}>
              <StyledIcon type={menu.iconType} /> {siderCollapsed ? '' : menu.name}
            </Link>
          </Menu.Item>
        ))}
      </StyledMenu>
    );
  }
}

const StyledMenu = styled(Menu)`
  height: 100%;
  border-right: 0;
`;

const Link = styled.a`
  text-decoration: none;
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledIcon = styled(Icon)`
  color: #4a90e2;
  font-size: 22px;
`;
