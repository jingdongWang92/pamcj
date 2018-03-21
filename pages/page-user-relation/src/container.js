import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import Component from './component';

function mapStateToProps(state) { // eslint-disable-line no-unused-vars
  return {
    isSubmitting: state.submitting,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}



export default connect(mapStateToProps, mapDispatchToProps)(Component);
