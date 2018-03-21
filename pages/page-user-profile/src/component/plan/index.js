import React from 'react';
import moment from 'moment';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Button from 'antd/es/button';

import IconMap from '../../icon/map.svg';
import IconProject from '../../icon/project.svg';
import IconDownload from '../../icon/todos.svg';
import IconLocation from '../../icon/location.svg';
import IconWrench from '../../icon/wrench.svg';
import IconLineChart from '../../icon/line_chart.svg';
import IconOfficeChair from '../../icon/office_chair.svg';
import IconMemo from '../../icon/memo.svg';


class UserPlan extends React.Component {

  render() {

    const { user } = this.props;

    const userOrganization = user ? user.organization : null;
    const organizationPlan = userOrganization ? userOrganization.plan : null;

    return (
      <div>
        <div className="panel-body">
          <Row style={{marginTop: '2em'}}>
            <Col span={4} style={{borderRight: 'solid #E7E9EA 1px'}}>
              <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>方案类型</p>
              <p style={{fontSize: '24px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>{ organizationPlan ? organizationPlan.name : '试用版'}</p>
            </Col>
            <Col span={4} offset={1} style={{borderRight: 'solid #E7E9EA 1px'}}>
              <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>购买方案</p>
              <p style={{fontSize: '24px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>年付</p>
            </Col>
            <Col span={4} offset={1} style={{borderRight: 'solid #E7E9EA 1px'}}>
              <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>到期时间</p>
              <p style={{fontSize: '24px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>{ !organizationPlan ? '' : moment(userOrganization.plan_expired_at).format('YYYY-MM-DD')}</p>
            </Col>
            <Col span={4} offset={1} style={{marginTop: '12px'}}>
              <Button type="primary" size="large" href="/pricing">查看方案</Button>
            </Col>
          </Row>
        </div>
        <Row style={{marginTop: '2em'}}>
          <Col span={6}>
            <Row>
              <Col span={6}>
                <img src={IconProject} alt="项目数量" style={{height: '4em',width: '4em'}}/>
              </Col>
              <Col span={18}>
                <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>项目数量</p>
                <p style={{fontSize: '18px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>{ organizationPlan ? organizationPlan.project_count : 1}个项目</p>
              </Col>
            </Row>
          </Col>
          <Col span={6} offset={1}>
            <Row>
              <Col span={6}>
                <img src={IconMap} alt="地图数量" style={{height: '4em',width: '4em'}}/>
              </Col>
              <Col span={18}>
                <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>地图数量</p>
                <p style={{fontSize: '18px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>{organizationPlan ? organizationPlan.map_count : 3}张地图</p>
              </Col>
            </Row>
          </Col>
          <Col span={6} offset={1}>
            <Row>
              <Col span={6}>
                <img src={IconDownload} alt="离线文件导出" style={{height: '4em',width: '4em'}}/>
              </Col>
              <Col span={18}>
                <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>离线文件导出</p>
                {( !organizationPlan || organizationPlan.name === '试用版') ?
                  <p style={{fontSize: '18px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>试用版暂不支持</p> :
                  <p style={{fontSize: '18px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>支持离线地图文件下载</p>
                }
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{marginTop: '2em'}}>
          <Col span={6}>
            <Row>
              <Col span={6}>
                <img src={IconLocation} alt="SDK工具" style={{height: '4em',width: '4em'}}/>
              </Col>
              <Col span={18}>
                <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>SDK工具</p>
                <p style={{fontSize: '18px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>免费使用地图渲染定位导航SDK</p>
              </Col>
            </Row>
          </Col>
          <Col span={6} offset={1}>
            <Row>
              <Col span={6}>
                <img src={IconWrench} alt="施工配置工具" style={{height: '4em',width: '4em'}}/>
              </Col>
              <Col span={18}>
                <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>施工配置工具</p>
                <p style={{fontSize: '18px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>免费试用施工配置工具</p>
              </Col>
            </Row>
          </Col>
          <Col span={6} offset={1}>
            <Row>
              <Col span={6}>
                <img src={IconLineChart} alt="后台设备管理" style={{height: '4em',width: '4em'}}/>
              </Col>
              <Col span={18}>
                <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>后台设备管理</p>
                {(!organizationPlan || organizationPlan.name === '试用版' || organizationPlan.name === '个人版') ?
                  <p style={{fontSize: '18px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>暂不支持</p> :
                  <p style={{fontSize: '18px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>定位后台设备管理平台</p>
                }
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{marginTop: '2em'}}>
          <Col span={6}>
            <Row>
              <Col span={6}>
                <img src={IconMemo} alt="自定义地图样式" style={{height: '4em',width: '4em'}}/>
              </Col>
              <Col span={18}>
                <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>自定义地图样式</p>
                {(!organizationPlan || organizationPlan.name === '试用版' || organizationPlan.name === '个人版') ?
                  <p style={{fontSize: '18px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>暂不支持</p> :
                  <p style={{fontSize: '18px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>支持样式自定义</p>
                }
              </Col>
            </Row>
          </Col>
          <Col span={6} offset={1}>
            <Row>
              <Col span={6}>
                <img src={IconOfficeChair} alt="专享客服支持" style={{height: '4em',width: '4em'}}/>
              </Col>
              <Col span={18}>
                <p style={{fontSize: '16px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>专享客服支持</p>
                {(!organizationPlan || organizationPlan.name === '试用版') ?
                  <p style={{fontSize: '18px', color:'#8E8E93', fontFamily: 'PingFangSC-Light'}}>暂不支持</p> :
                  <p style={{fontSize: '18px', color:'#3498DB', fontFamily: 'PingFangSC-Light'}}>5*8在线支持</p>
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserPlan;
