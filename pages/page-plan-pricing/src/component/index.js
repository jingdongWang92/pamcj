import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OrganizationPicker from './OrganizationPicker';
import PayMethodPicker from './PayMethodPicker';
import WxPayBarCode from './WxPayBarCode';
import PayWaiting from './PayWaiting';
import PaySuccess from './PaySuccess';
import {
  LEVEL_0,
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
} from '@jcmap/constant-plan-levels';

import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Button from 'antd/es/button';

export default class PagePlanPricing extends Component {

  static propTypes = {
    fetchPlanByLevel: PropTypes.func.isRequired,
    planLevel0: PropTypes.object,
    planLevel1: PropTypes.object,
    planLevel2: PropTypes.object,
    planLevel3: PropTypes.object,
  }


  componentDidMount() {
    this.props.fetchUserInfo();
    this.props.fetchPlanByLevel(LEVEL_0);
    this.props.fetchPlanByLevel(LEVEL_1);
    this.props.fetchPlanByLevel(LEVEL_2);
    this.props.fetchPlanByLevel(LEVEL_3);
  }


  selectOrganization = organization => {
    if (!organization) {
      this.props.unselectOrganizationSuccess();
      return;
    }

    this.props.selectOrganizationSuccess(organization);
  }


  render() {
    const {
      user,
      planLevel1,
      planLevel2,
      planLevel3,

      selectedPlan,
      selectedOrganization,
      selectedPayMethod,

      selectPlanSuccess: selectPlan,
      unselectPlanSuccess: unselectPlan,

      unselectOrganizationSuccess: unselectOrganization,

      selectPayMethodSuccess: selectPayMethod,
      unselectPayMethodSuccess: unselectPayMethod,

      createOrder,
      order,
      wxpayInfo,
      step,
      organizations,
      checkoutWithAlipay,
      checkoutWithWxpay,
    } = this.props;


    return (
      <div>
        <div style={{backgroundColor: '#24292e', height: '78px'}}>
        </div>
        <div style={{margin: '3%'}}>
          <h1 style={{fontSize: '54px', textAlign: 'center', fontWeight: '300'}}>新品发布 免费试用</h1>
          <h3 style={{fontSize: '20px', textAlign: 'center', fontWeight: '300'}}>根据您的需求选择合适的付费方案</h3>
        </div>
        <Row>
          <Col lg={{ span: 4, offset: 4 }} xxl={{ span: 3, offset: 6 }}>
            <div>
              <div className="plan-card">
                <div className="panel-body">
                  <h2 style={{color: '#0366d6'}}>免费版</h2>
                </div>
                <p style={{margin: '10px',fontSize: '28px'}}>¥ 0</p>
                <Button type="default" style={{width: '100px', color:'#0366d6'}}>免费试用</Button>
                <h4 style={{margin: '15px 0'}}>功能</h4>
                <p style={{margin: '5px'}}>1个项目</p>
                <p style={{margin: '5px'}}>3张地图</p>
              </div>
            </div>
          </Col>
          <Col lg={{ span: 4 }} xxl={{ span: 3 }}>
            <div>
              <div className="plan-card">
                <div className="panel-body">
                  <h2 style={{color: '#28a745'}}>{ planLevel1 ? planLevel1.name : '个人版'}</h2>
                </div>
                {planLevel1 && (<p style={{margin: '10px'}}><span style={{fontSize: '28px'}}>￥{planLevel1.price}</span><span>/年</span></p>)}
                {!user && (<Button type="default" style={{width: '100px', color:'#28a745'}} href={`/login?redirect-url=${window.encodeURIComponent(window.location.href)}`}>购买</Button>)}
                {user && planLevel1 && (user.plan && user.plan.id === planLevel1.id) && (<span>已经拥有</span>)}
                {user && planLevel1 && (!user.plan || (user.plan && user.plan.id !== planLevel1.id)) && (<Button type="default" style={{width: '100px', color:'#28a745'}} onClick={() => selectPlan(planLevel1)}>升级</Button>)}
                <h4 style={{margin: '15px 0'}}>功能</h4>
                <p style={{margin: '5px'}}>{planLevel1 && planLevel1.project_count} 个项目</p>
                <p style={{margin: '5px'}}>{planLevel1 && planLevel1.map_count} 张地图</p>
                <p style={{margin: '5px'}}>地图数据导出</p>
              </div>
            </div>
          </Col>
          <Col lg={{ span: 4 }} xxl={{ span: 3 }}>
            <div>
              <div className="plan-card">
                <div className="panel-body">
                  <h2 style={{color: '#6f42c1'}}>{ planLevel2 ? planLevel2.name : '团队版'}</h2>
                </div>
                {planLevel2 && (<p style={{margin: '10px'}}><span style={{fontSize: '28px'}}>￥{planLevel2.price}</span><span>/年</span></p>)}
                {!user && (<Button type="default" style={{width: '100px', color:'#6f42c1'}} href={`/login?redirect-url=${window.encodeURIComponent(window.location.href)}`}>购买</Button>)}
                {user && planLevel2 && (user.plan && user.plan.id === planLevel2.id) && (<button type="button" onClick={() => selectPlan(planLevel2)}>已经拥有</button>)}
                {user && planLevel2 && (!user.plan || (user.plan && user.plan.id !== planLevel2.id)) && (<Button type="default" style={{width: '100px', color:'#6f42c1'}} onClick={() => selectPlan(planLevel2)}>升级</Button>)}
                <h4 style={{margin: '15px 0'}}>功能</h4>
                <p style={{margin: '5px'}}>{planLevel2 && planLevel2.project_count} 个项目</p>
                <p style={{margin: '5px'}}>{planLevel2 && planLevel2.map_count} 张地图</p>
                <p style={{margin: '5px'}}>地图数据导出</p>
              </div>
            </div>
          </Col>
          <Col lg={{ span: 4 }} xxl={{ span: 3 }}>
            <div>
              <div className="plan-card">
                <div className="panel-body">
                  <h2 style={{color: '#1890ff'}}>{ planLevel3 ? planLevel3.name : '企业版'}</h2>
                </div>
                {planLevel3 && (<p style={{margin: '10px'}}><span style={{fontSize: '28px'}}>￥{planLevel3.price}</span><span>/年</span></p>)}
                {!user && (<Button type="default" style={{width: '100px', color:'#1890ff'}} href={`/login?redirect-url=${window.encodeURIComponent(window.location.href)}`}>购买</Button>)}
                {user && planLevel3 && (user.plan && user.plan.id === planLevel3.id) && (<button type="button" onClick={() => selectPlan(planLevel3)}>已经拥有</button>)}
                {user && planLevel3 && (!user.plan || (user.plan && user.plan.id !== planLevel3.id)) && (<Button type="default" style={{width: '100px'}} onClick={() => selectPlan(planLevel3)}>升级</Button>)}
                <h4 style={{margin: '15px 0'}}>功能</h4>
                <p style={{margin: '5px'}}>{planLevel3 && planLevel3.project_count} 个项目</p>
                <p style={{margin: '5px'}}>{planLevel3 && planLevel3.map_count} 张地图</p>
                <p style={{margin: '5px'}}>地图数据导出</p>
              </div>
            </div>
          </Col>
        </Row>

        {step === 1 && (
          <OrganizationPicker
            unselectPlan={unselectPlan}
            selectOrganization={this.selectOrganization}
            unselectOrganization={unselectOrganization}
            createOrder={createOrder}
            organizations={organizations}
          />
        )}


        {step === 2 && (
          <PayMethodPicker
            selectPayMethod={selectPayMethod}
            checkoutWithAlipay={checkoutWithAlipay}
            checkoutWithWxpay={checkoutWithWxpay}
            selectedOrganization={selectedOrganization}
            selectedPlan={selectedPlan}
            selectedPayMethod={selectedPayMethod}
            unselectPayMethod={unselectPayMethod}
            order={order}
          />
        )}


        {step === 3 && selectedPayMethod === 'wxpay' && (
          <WxPayBarCode wxpayInfo={wxpayInfo} />
        )}


        {step === 3 && selectedPayMethod !== 'wxpay' && (
          <PayWaiting />
        )}


        {step === 4 && (
          <PaySuccess />
        )}
      </div>
    );
  }
}
