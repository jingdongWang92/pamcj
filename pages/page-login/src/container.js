import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import Component from './component';

function mapStateToProps(state) { // eslint-disable-line no-unused-vars
  return {
    initialValues: {
      grant_type: 'password',
    },
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}



export default connect(mapStateToProps, mapDispatchToProps)(Component);
