import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Radio from 'antd/es/radio';
import assign from 'lodash/fp/assign';
import Select from 'antd/es/select';


export default class LayerEditor extends React.Component {
  static contextTypes = {
    layers: PropTypes.array.isRequired,
    selectedFeature: PropTypes.object.isRequired,
    updateFeature: PropTypes.func.isRequired,
  }


  handleLayerChange = layers => selecteLayerId => {
    const { selectedFeature, updateFeature } = this.context;

    const newLayer = layers.find(_layer => _layer.id === selecteLayerId);
    const newGeometryStyle = selectedFeature.geometry_style_id === selectedFeature.layer.geometry_style_id
      ? newLayer.geometry_style
      : selectedFeature.geometry_style;

    const newFeature = assign(selectedFeature, {
      layer_id: newLayer.id,
      layer: newLayer,
      geometry_style_id: newGeometryStyle.id,
      geometry_style: newGeometryStyle,
    });


    updateFeature(newFeature);
  }

  handleDisplayWayChange = (evt) => {
    const { selectedFeature, updateFeature } = this.context;
    const newFeature = Object.assign({}, selectedFeature, {
      displpay_way: evt.target.value,
    });
    updateFeature(newFeature);
  }

  render() {
    const { layers, selectedFeature } = this.context;
    const { layer_id, geometry_type } = selectedFeature;
    const fitLayers = layers.filter(_layer => _layer.geometry_type === geometry_type);


    return [
      <Form.Item key="layers" label="图层">
        <Select value={layer_id} onChange={this.handleLayerChange(fitLayers)} >
          {fitLayers.map((layer) => (
            <Select.Option
              key={layer.id}
              value={layer.id}
            >{`${layer.name || layer.code} (${layer.is_created_by_system ? 'system' : 'custom'})`}</Select.Option>
          ))}
        </Select>
      </Form.Item>,

      <Form.Item key="feature-presentation" label="呈现方式">
        <Radio.Group defaultValue="horizontal" onChange={this.handleDisplayWayChange}>
          <Radio.Button value="segment">线段</Radio.Button>
          <Radio.Button value="curve">曲线</Radio.Button>
        </Radio.Group>
      </Form.Item>
    ];
  }
}
