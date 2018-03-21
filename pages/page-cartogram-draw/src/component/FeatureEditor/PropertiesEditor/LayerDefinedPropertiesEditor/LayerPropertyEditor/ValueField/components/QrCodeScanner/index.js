import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import QrCode from 'qrcode-reader';


const CAMERA_REAR = {
  video: {
    facingMode: 'environment',
  },
};

const VIDEO_ASPECT_RATIO = 4 / 3;
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = VIDEO_WIDTH / VIDEO_ASPECT_RATIO;


const ERROR_MESSAGES = {
  NotAllowedError: '用户未授权使用摄像头',
  PermissionDeniedError: '用户未授权使用摄像头',
};


class QrCodeScanner extends React.Component {
  state = {
    status: '正在启动...',
  };

  componentDidMount() {
    this.start();
  }


  componentWillUnmount() {
    this.stop();
  }


  setLabel = label => {
    this.setState(state => ({
      ...state,
      status: label,
    }));
  }

  start = async () => {
    try {
      const stream = this.stream = await navigator.mediaDevices.getUserMedia(CAMERA_REAR);
      this.player.srcObject = stream;


      this.setLabel('扫描中...');


      const canvas = document.createElement('canvas');
      canvas.width = VIDEO_WIDTH;
      canvas.height = VIDEO_HEIGHT;
      const canvasCtx = canvas.getContext('2d');


      const qr = new QrCode();
      qr.callback = (err, data) => {
        if (err) { return; }
        this.props.onChange(data.result);

        this.stop();
      }


      this.scanningLoop = window.setInterval(() => {
        canvasCtx.drawImage(this.player, 0, 0);
        const imgData = canvasCtx.getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        qr.decode(imgData);
      }, 200);
    } catch (err) {
      this.setLabel(ERROR_MESSAGES[err.name] || err.name)
    }
  }


  stop = () => {
    if (this.scanningLoop) {
      window.clearInterval(this.scanningLoop);
    }

    if (this.stream) {
      this.stream.getVideoTracks().forEach(track => track.stop());
    }
  }


  render() {
    return (
      <div className="qr-code-scanner-container">
        <span className="qr-code-scanner-hint">{this.state.status}</span>

        <video
          className="qr-code-scanner-player"
          autoPlay
          ref={player => this.player = player}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
        >你的浏览器不支持扫码</video>

        <button
          type="button"
          className="btn btn-default qr-code-scanner-close"
          onClick={() => this.props.onClose()}
        >关闭</button>

        <div className="qr-code-scanner-mask">
        </div>
      </div>
    );
  }
}


QrCodeScanner.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default QrCodeScanner;
