import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import Component from './component';
import { mapStateToProps } from './selectors';


export default connect(mapStateToProps, dispatch => bindActionCreators(actions, dispatch))(Component);
