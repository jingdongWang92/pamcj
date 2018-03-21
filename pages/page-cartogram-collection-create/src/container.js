import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import Component from './component';
import { getProps } from './selectors';


export default connect(getProps, dispatch => bindActionCreators(actions, dispatch))(Component);
