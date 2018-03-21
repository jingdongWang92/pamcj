import React from 'react';
import PropTypes from 'prop-types';
import Upload from 'antd/es/upload';
import Icon from 'antd/es/icon';
import Modal from 'antd/es/modal';
import request from '@jcnetwork/util-better-request';
import styled from 'styled-components';
import assign from 'lodash/fp/assign';
import nanoid from 'nanoid';


export default class FileUploadPlaceHolder extends React.Component {

  static propTypes = {
    fieldName: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    accept: PropTypes.string,
    uploadEndpoint: PropTypes.string,
    downloadEndpoint: PropTypes.string
  }

  static defaultProps = {
    accept: 'image/*',
    uploadEndpoint: '/apis/storage/presigned-put-url',
    downloadEndpoint: '/apis/storage',
  }

  state = {
    loading: false,
    fileList: [],
  }

  constructor(props) {
    super(props);

    const { fieldName, value, downloadEndpoint } = props;

    const fileList = [];
    if (value) {
      fileList.push(createFileListItem(fieldName, `${downloadEndpoint}/${value}`));
    }

    this.state = {
      loading: false,
      fileList,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {

      const { fieldName, value, downloadEndpoint } = nextProps;
      this.setState(state => ({
        ...state,
        fileList: [createFileListItem(fieldName, `${downloadEndpoint}/${value}`)],
      }));
    } else {
      this.setState(state => ({
        ...state,
        fileList: [],
      }));
    }
  }

  handleChange = info => {
    const { file, fileList } = info;
    const { status } = file;

    this.setState(state => assign(state, {
      fileList,
    }));

    if (status === 'uploading') {
      this.setState(state => assign(state, {
        loading: true,
      }));
    } else if (status === 'done') {
      const { response } = file;
      const { objectName } = response.payload;

      this.setState(state => assign(state, {
        loading: false,
      }));
      this.props.onChange(objectName);
    }
  }

  handlePreview = (file) => {
    this.setState(state => assign(state, {
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    }));
  }

  handleCancel = () => {
    this.setState(state => assign(state, {
      previewVisible: false,
    }));
  }

  handleRemove = (file) => {
    this.props.onChange('');
  }

  customRequest = async (options) => {
    const {
      onProgress,
      onError,
      onSuccess,
      file,
    } = options;

    try {
      const res = await request({
        method: 'get',
        endpoint: '/apis/storage/presigned-put-url',
      });

      await request({
        method: 'put',
        endpoint: res.payload.objectPutUrl,
        payload: file,
        headers: {
          'content-type': 'application/octet-stream',
        },
        onProgress: evt => onProgress(evt, file),
      });
      onSuccess(res, file);
    } catch (err) {
      onError(err, file);
    }
  }


  render() {
    const { loading, previewVisible, previewImage, fileList } = this.state;
    const { fieldName, accept } = this.props;

    return [
      <Upload
        key="uploader"
        name={fieldName}
        listType="picture-card"
        fileList={fileList}
        accept={accept}
        onChange={this.handleChange}
        onPreview={this.handlePreview}
        onRemove={this.handleRemove}
        customRequest={this.customRequest}
      >
        {fileList.length >= 1 ? null  : <UploadButton loading={loading} />}
      </Upload>,

      <Modal
        key="previewer"
        visible={previewVisible}
        footer={null}
        onCancel={this.handleCancel}
      >
        <Image src={previewImage} />
      </Modal>,
    ];
  }
}


function UploadButton({ loading }) {
  return (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
}


const Image = styled.img`
  width: 100%;
`;


function createFileListItem(fileName, fileLink, status = 'done') {
  return {
    uid: nanoid(),
    name: fileName,
    status,
    url: fileLink,
  };
}
