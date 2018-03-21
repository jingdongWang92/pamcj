import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import Component from './component';


function mapStateToProps(state) {
  return {
    initialValues: {
      token: state.token,
    }
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
