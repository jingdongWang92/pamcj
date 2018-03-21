import React from 'react';
import { Field } from 'redux-form';
import Icon from 'antd/es/icon';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Select from 'antd/es/select';
import Button from 'antd/es/button';


const Option = Select.Option;


export default function CartogramList({ fields, cartograms, cartogramSelectStatus }) {
  const components = [];

  if (!fields.length) {
    if (cartograms.length) {
      components.push(
        <Select key="first" onChange={cartogramId => fields.push(cartogramId)} defaultValue="">
          <Option value="" disabled>请选择地图</Option>
          {cartograms.map(cartogram => (
            <Option key={cartogram.id} value={cartogram.id}>{cartogram.name}</Option>
          ))}
        </Select>
      );
    } else {
      components.push(
        <span key="no-cartogram-link" style={{ marginLeft: '1em' }} >
          你还没有任何地图，立刻去<Button type="ghost" href="/cartogram/create">创建地图</Button>
        </span>
      );
    }
  } else {
    fields.forEach((fieldName, index) => {
      components.push(
        <Field
          key={fieldName}
          name={fieldName}
          component={CartogramItem}
          cartograms={cartograms}
          cartogramSelectStatus={cartogramSelectStatus}
          isFirst={index === 0}
          isLast={index === fields.length - 1}
          noMoreCartogram={fields.length >= cartograms.length}
          removeCartogram={() => fields.remove(index)}
          addCartogram={() => fields.push('')}
          moveUpCartogram={() => fields.move(index, index - 1)}
          moveDownCartogram={() => fields.move(index, index + 1)}
        />
      );
    });
  }


  if (cartograms.length) {
    components.push(
      <div key="button" className="text-center" style={{marginTop: '20px'}}>
        <span>没有你想要的地图？去<Button type="ghost" href="/cartogram/create">创建地图</Button></span>
      </div>
    );
  }

  return components;
}


function CartogramItem(props) {
  const {
    input,
    cartograms,
    cartogramSelectStatus,
    isFirst,
    isLast,
    noMoreCartogram,
    removeCartogram,
    addCartogram,
    moveUpCartogram,
    moveDownCartogram,
  } = props;

  return (
    <Row>
      <Col span={18}>
        <Select {...input}>
          <Option value="" disabled>请选择地图</Option>
          {cartograms.map(cartogram => (
            <Option key={cartogram.id} value={cartogram.id} disabled={cartogramSelectStatus[cartogram.id]}>{cartogram.name}</Option>
          ))}
        </Select>
      </Col>

      <Col span={6}>
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          style={{color: "red", marginLeft: '0.5em'}}
          onClick={removeCartogram}
        />

        {!isFirst && (
          <Icon
            className="dynamic-delete-button"
            type="arrow-up"
            style={{color: "black",marginLeft: '0.5em'}}
            onClick={moveUpCartogram}
          />
        )}

        {!isLast && (
          <Icon
            className="dynamic-delete-button"
            type="arrow-down"
            style={{color: "black",marginLeft: '0.5em'}}
            onClick={moveDownCartogram}
          />
        )}

        {isLast && !noMoreCartogram && (
          <Icon
            className="dynamic-delete-button"
            type="plus-circle-o"
            style={{color: "green",marginLeft: '0.5em'}}
            onClick={addCartogram}
          />
        )}
      </Col>
    </Row>
  )
}
