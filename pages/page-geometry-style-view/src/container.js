import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import Component from './component';
import * as selectors from './selectors';


function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}



export default connect(selectors.getProps, mapDispatchToProps)(Component);
