import React from 'react';
import PropTypes from 'prop-types';
import LayerEditor from './LayerEditor';
import GeometryStyleEditor from './GeometryStyleEditor';
import PropertiesEditor from './PropertiesEditor';
import Button from 'antd/es/button';
import Collapse from 'antd/es/collapse';


export default class FeatureEditor extends React.Component {
  static contextTypes = {
    selectedFeature: PropTypes.object,
    removeFeature: PropTypes.func.isRequired,
  }


  render() {
    const { selectedFeature, removeFeature } = this.context;

    return (
      <Collapse defaultActiveKey={['properties-editor', "actions"]}>
        <Collapse.Panel key="layer-editor" header="图层">
          <LayerEditor />
        </Collapse.Panel>

        <Collapse.Panel key="geometry-style-editor" header="样式">
          <GeometryStyleEditor />
        </Collapse.Panel>

        <Collapse.Panel key="properties-editor" header="属性">
          <PropertiesEditor />
        </Collapse.Panel>

        <Collapse.Panel key="actions" header="Actions">
          <Button type="danger" size="small" style={{ width: '100%' }} onClick={() => removeFeature(selectedFeature)}>删除元素</Button>
        </Collapse.Panel>
      </Collapse>
    );
  }
}
