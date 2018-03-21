import React from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form';
import Page from '@jcmap/component-app-shell';
import { MODULE_NAME } from '../constants';
import PropTypes from 'prop-types';
import Input from 'antd/es/input';
import Icon from 'antd/es/icon';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Card from 'antd/es/card';
import URI from '@jcnetwork/util-uri';

class CartogramCollectionUpdate extends React.Component {

  componentDidMount() {
    this.props.searchCartograms((new URI()).setQuery({ limit: 1000, sort_by: 'created_at', sort: 'desc' }).getSafeSearch());
    const hashParams = (new URI()).hash(true);
    const cartogramCollectionId = hashParams.cartogram_collection_id || hashParams.cartogram_collection;
    this.props.fetchCartogramCollection(cartogramCollectionId);
  }


  render() {
    const { handleSubmit, updateCartogramCollection, cartograms } = this.props;

    return (
      <Page>
        <Card
          bordered={false}
          title={ <span style={{ fontSize: '30px' }}>编辑项目</span> }
          extra={<Button htmlType="submit" type="primary" size="large" form={MODULE_NAME}>提交</Button>}>
          <Form
            id={MODULE_NAME} onSubmit={handleSubmit(updateCartogramCollection)}>

              <Field name="id" component="input" type="hidden" />

              <Field
                name="name"
                label="项目名称"
                placeholder="请输入项目名称"
                component={InputBox}
                required={true}
              />

              <FieldArray
                name="cartogram_ids"
                component={CartogramList(cartograms, {
                  label: '包含地图',
                })}
              />
          </Form>
        </Card>
      </Page>
    );
  }
}

CartogramCollectionUpdate.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  fetchCartogramCollection: PropTypes.func.isRequired,
  updateCartogramCollection: PropTypes.func.isRequired,
  searchCartograms: PropTypes.func.isRequired,
  cartograms: PropTypes.array.isRequired,
};

export default reduxForm({ form: MODULE_NAME })(CartogramCollectionUpdate);


function RawSelectBox({ children, ...rest }) {
  return (
    <select className="form-control" {...rest}>
      {children}
    </select>
  );
}


function CartogramList(cartograms, options) {
  return ({ fields }) => {
    return (
      <FormItem label={options.label} hint={options.hint}>
        {fields.map((fieldName, index) => (
          <div style={{marginBottom: '15px'}} key={fieldName}>
            <Field
              key={fieldName}
              name={fieldName}
              component={CartogramItem}
              cartograms={cartograms}
              onRemove={() => fields.remove(index)}
            />
          </div>
        ))}

        <div className="text-center">
          <Button
            htmlType="button"
            type="primary"
            size="large"
            onClick={() => fields.push('')}
            style={{ marginRight: '1em',width: '20%' }}
          ><Icon type="plus" />添加地图</Button>

          <span
            style={{ marginLeft: '1em' }}
          >没有你想要的地图？<a className="btn btn-link" href="/cartogram/create">去创建</a></span>
        </div>
      </FormItem>
    );
  }
}


function CartogramItem({ input, onRemove, cartograms }) {
  return (
    <Row>
      <Col span={22}>
        <RawSelectBox {...input}>
          <option value="">请选择地图</option>
          {cartograms.map(cartogram => (
            <CartogramOption key={cartogram.id} cartogram={cartogram} currentCartogramId={input.value} />
          ))}
        </RawSelectBox>
      </Col>
      <Col span={2}>
        <Icon
          className="dynamic-delete-button pull-right"
          type="minus-circle-o"
          onClick={onRemove}
          style={{color: "red"}}
        />
      </Col>
    </Row>
  )
}

function FormItem(props) {
  return (
    <Form.Item
      labelCol={{
        xs: { span: 24 },
        sm: { span: 6 },
      }}
      wrapperCol={{
        xs: { span: 24 },
        sm: { span: 12 },
      }}
      {...props}
    />
  );
}

function InputBox({ input, onInput, ...rest }) {
  return (
    <FormItem {...rest}>
      <Input {...input} onInput={onInput} />
    </FormItem>
  );
}


function CartogramOption({ cartogram, currentCartogramId }) {
  return (
    <option
      value={cartogram.id}
      disabled={cartogram.__disabled && currentCartogramId !== cartogram.id}
    >{cartogram.name}</option>
  );
}
