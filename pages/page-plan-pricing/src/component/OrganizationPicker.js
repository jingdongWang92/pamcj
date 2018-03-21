import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/es/modal';


export default class OrganizationPicker extends Component {

  static propTypes = {
    unselectPlan: PropTypes.func.isRequired,
    selectOrganization: PropTypes.func.isRequired,
    unselectOrganization: PropTypes.func.isRequired,
    createOrder: PropTypes.func.isRequired,
    organizations: PropTypes.array,
  }


  selectOrganization = organization => {
    if (!organization) {
      this.props.unselectOrganization();
      return;
    }

    this.props.selectOrganization(organization);
  }


  render() {
    const {
      unselectPlan,
      unselectOrganization,
      createOrder,
      organizations,
    } = this.props;


    return (
      <Modal
        title="创建订单"
        visible={true}
        onOk={() => createOrder()}
        onCancel={() => { unselectOrganization(); unselectPlan(); }}
      >
        <select onChange={evt => this.selectOrganization(organizations[evt.target.value])}>
          <option value={-1}>请选择买家</option>
          {organizations.map((organization, index) => (
            <option key={organization.id} value={index}>{organization.personal ? '为自己购买' : organization.name}</option>
          ))}
        </select>
      </Modal>
    );
  }
}
