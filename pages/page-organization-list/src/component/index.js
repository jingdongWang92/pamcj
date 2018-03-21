import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppShell from '@jcmap/component-app-shell';
import Button from 'antd/es/button';
import Tabs from 'antd/es/tabs';
import Card from 'antd/es/card';
import OrganizationCreateForm from './OrganizationCreateForm';
import OrganizationList from './OrganizationList';
import OrganizationInvitationList from './OrganizationInvitationList';
import OrganizationMemberList from './OrganizationMemberList';
import OrganizationUpdateForm from './OrganizationUpdateForm';

import {
  ORGANIZATION_ADD_SUCCESS,
  ORGANIZATION_EDIT_SUCCESS,
  ORGANIZATION_INVITATION_ADD_SUCCESS,
  TAB_ORGANIZATION_LIST,
  TAB_ORGANIZATION_INVITATION_LIST,
  ORGANIZATION_NAME_EDIT_SUCCESS,
} from '../constants';
import OrganizationInvitationCreateForm from './OrganizationInvitationCreateForm';
import { MEMBER } from '@jcmap/constant-organization-roles';


class Organization extends Component {

  static propTypes = {
    fetchUserSelf: PropTypes.func.isRequired,
    searchOrganizations: PropTypes.func.isRequired,
    createOrganization: PropTypes.func.isRequired,
    updateOrganization: PropTypes.func.isRequired,
    createOrganizationInvitation: PropTypes.func.isRequired,
    editOrganizationSuccess: PropTypes.func.isRequired,
    removeOrganization: PropTypes.func.isRequired,
    removeOrganizationMember: PropTypes.func.isRequired,
    quitOrganization: PropTypes.func.isRequired,
    viewOrganizationSuccess: PropTypes.func.isRequired,
    addOrganizationSuccess: PropTypes.func.isRequired,
    addOrganizationInvitationSuccess: PropTypes.func.isRequired,
    searchOrganizationInvitations: PropTypes.func.isRequired,
    acceptOrganizationInvitation: PropTypes.func.isRequired,
    rejectOrganizationInvitation: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    organizations: PropTypes.array.isRequired,
    organizationInvitations: PropTypes.array.isRequired,
    interactiveOrganization: PropTypes.object,
    isCreating: PropTypes.bool.isRequired,
    myself: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    defaultActiveTabKey: TAB_ORGANIZATION_LIST,
  }

  componentDidMount() {
    this.props.fetchUserSelf();

    this.handleTabChange(this.props.defaultActiveTabKey);
  }


  handleTabChange = activeTabKey => {
    if (activeTabKey === TAB_ORGANIZATION_LIST) {
      this.props.searchOrganizations();
    } else if (activeTabKey === TAB_ORGANIZATION_INVITATION_LIST) {
      this.props.searchOrganizationInvitations();
    }
  }


  render() {
    const {
      organizations,
      createOrganization,
      updateOrganization,
      edittingOrganization,
      interactiveOrganization,
      createOrganizationInvitation,
      editOrganizationSuccess: editOrganization,
      editOrganizationNameSuccess: editOrganizationName,
      organizationInvitations,
      removeOrganization,
      removeOrganizationMember,
      isCreating,
      viewOrganizationSuccess: viewOrganization,
      addOrganizationSuccess: addOrganization,
      mode,
      addOrganizationInvitationSuccess: addOrganizationInvitation,
      searchOrganizationInvitations,
      acceptOrganizationInvitation,
      rejectOrganizationInvitation,
      searchOrganizations,
      quitOrganization,
      myself,
      isLoading,
      isUpdating,
    } = this.props;


    return (
      <AppShell>
        <Card
          bordered={false}
          title={<span style={{ fontSize: '30px' }}>我的团队</span>}
          extra={<Button key="layer-create" type="primary" size="large" onClick={() => addOrganization()}>创建团队</Button>}
        />
        <div style={{ padding: '15px' }}>
          <Tabs defaultActiveKey={TAB_ORGANIZATION_LIST} size="large" onChange={this.handleTabChange}>
            <Tabs.TabPane tab="我已加入的" key={TAB_ORGANIZATION_LIST}>
              <OrganizationList
                searchOrganizations={searchOrganizations}
                editOrganization={editOrganization}
                updateOrganization={updateOrganization}
                editOrganizationName={editOrganizationName}
                removeOrganization={removeOrganization}
                addOrganizationInvitation={addOrganizationInvitation}
                quitOrganization={quitOrganization}
                organizations={organizations}
                myself={myself}
                isLoading={isLoading}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="已邀请我的" key={TAB_ORGANIZATION_INVITATION_LIST}>
              <OrganizationInvitationList
                organizationInvitations={organizationInvitations}
                searchOrganizationInvitations={searchOrganizationInvitations}
                acceptOrganizationInvitation={acceptOrganizationInvitation}
                rejectOrganizationInvitation={rejectOrganizationInvitation}
                isLoading={isLoading}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>

        {mode === ORGANIZATION_ADD_SUCCESS && (
          <OrganizationCreateForm
            createOrganization={createOrganization}
            viewOrganization={viewOrganization}
            isCreating={isCreating}
          />
        )}

        {mode === ORGANIZATION_EDIT_SUCCESS && (
          <OrganizationMemberList
            edittingOrganization={edittingOrganization}
            viewOrganization={viewOrganization}
            createOrganizationInvitation={createOrganizationInvitation}
            removeOrganizationMember={removeOrganizationMember}
          />
        )}

        {mode === ORGANIZATION_INVITATION_ADD_SUCCESS && (
          <OrganizationInvitationCreateForm
            viewOrganization={viewOrganization}
            createOrganizationInvitation={createOrganizationInvitation}
            isCreating={isCreating}
            organization={interactiveOrganization}
            initialValues={{
              organization_id: interactiveOrganization.id,
              role: MEMBER.code,
            }}
          />
        )}

        {mode === ORGANIZATION_NAME_EDIT_SUCCESS && (
          <OrganizationUpdateForm
            updateOrganization={updateOrganization}
            isUpdating={isUpdating}
            viewOrganization={viewOrganization}
            initialValues={edittingOrganization}
          />
        )}
      </AppShell>
    );
  }
}

export default Organization;
