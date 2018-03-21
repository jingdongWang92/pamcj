import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import Component from './component';
import * as selectors from './selectors';


function mapStateToProps(state) {
  return {
    initialValues: selectors.getCartogramCollection(state),
    cartograms: selectors.getMarkedCartograms(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}



export default connect(mapStateToProps, mapDispatchToProps)(Component);
