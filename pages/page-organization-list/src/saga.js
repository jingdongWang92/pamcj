import { takeEvery, fork, put, call, all } from 'redux-saga/effects';
import * as apis from './apis';
import * as constants from './constants';
import * as actions from './actions';
import swal from 'sweetalert2';


function * watchFetchUserSelf() {
  yield takeEvery(constants.USER_SELF_FETCH, function * fetchUserSelf(action) {
    try {
      const res = yield call(apis.fetchUserSelf);
      yield put(actions.fetchUserSelfSuccess(res.payload));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchSearchOrganizations() {
  yield takeEvery(constants.ORGANIZATIONS_SEARCH, function * searchOrganizations(action) {
    try {
      const res = yield call(apis.searchOrganizations, action.payload);
      yield put(actions.searchOrganizationsSuccess(res));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchSearchOrganizationInvitations() {
  yield takeEvery(constants.ORGANIZATION_INVITATIONS_SEARCH, function * searchOrganizationInvitations(action) {
    try {
      const res = yield call(apis.searchOrganizationInvitations, action.payload);
      yield put(actions.searchOrganizationInvitationsSuccess(res));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchCreateOrganization() {
  yield takeEvery(constants.ORGANIZATION_CREATE, function * createOrganization(action) {
    try {
      const organization = action.payload;
      const res = yield call(apis.createOrganization, organization);
      yield put(actions.createOrganizationSuccess(res));
      yield call(() => swal('创建成功'));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchEditOrganization() {
  yield takeEvery(constants.ORGANIZATION_EDIT, function * editOrganization(action) {
    try {
      const organization = action.payload;
      const res = yield call(apis.searchOrganizationMembers, organization);
      yield put(actions.searchOrganizationMembersSuccess(res));
      yield put(actions.editOrganizationSuccess(organization));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchUpdateOrganization() {
  yield takeEvery(constants.ORGANIZATION_UPDATE, function * updateOrganization(action) {
    try {
      const organization = action.payload;
      const res = yield call(apis.updateOrganization, organization);
      yield put(actions.updateOrganizationSuccess(res));
      yield call(() => swal('团队信息修改成功'));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchRemoveOrganization() {
  yield takeEvery(constants.ORGANIZATION_REMOVE, function * removeOrganization(action) {
    try {
      const organization = action.payload;
      yield call(apis.removeOrganization, organization);
      yield put(actions.removeOrganizationSuccess(organization));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchQuitOrganization() {
  yield takeEvery(constants.ORGANIZATION_QUIT, function * quitOrganization(action) {
    try {
      const organization = action.payload;
      yield call(apis.removeOrganizationMember, organization.relationship_with_me);
      yield put(actions.quitOrganizationSuccess(organization));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchCreateOrganizationInvitation() {
  yield takeEvery(constants.ORGANIZATION_INVITATION_CREATE, function * createOrganizationInvitation(action) {
    try {
      const res = yield call(apis.createOrganizationInvitation, action.payload);
      yield put(actions.createOrganizationInvitationSuccess(res.payload));
      yield call(() => swal('邀请成功'));
    } catch (err) {
      yield call(() => swal('错误', err.message, 'error'));
    }
  });
}


function * watchAcceptOrganizationInvitation() {
  yield takeEvery(constants.ORGANIZATION_INVITATION_ACCEPT, function * acceptOrganizationInvitation(action) {
    try {
      const organizationInvitation = action.payload;
      yield call(apis.acceptOrganizationInvitation, organizationInvitation);
      yield put(actions.acceptOrganizationInvitationSuccess(organizationInvitation));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchRejectOrganizationInvitation() {
  yield takeEvery(constants.ORGANIZATION_INVITATION_REJECT, function * rejectOrganizationInvitation(action) {
    try {
      const organizationInvitation = action.payload;
      yield call(apis.rejectOrganizationInvitation, organizationInvitation);
      yield put(actions.rejectOrganizationInvitationSuccess(organizationInvitation));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


function * watchRemoveOrganizationMember() {
  yield takeEvery(constants.ORGANIZATION_MEMBER_REMOVE, function * removeOrganizationMember(action) {
    try {
      const organizationMember = action.payload;
      yield call(apis.removeOrganizationMember, organizationMember);
      yield put(actions.removeOrganizationMemberSuccess(organizationMember));
    } catch (err) {
      yield call(() => swal(err.message));
    }
  });
}


export default function * rootSaga() {
  yield all([
    fork(watchFetchUserSelf),
    fork(watchSearchOrganizations),
    fork(watchCreateOrganization),
    fork(watchUpdateOrganization),
    fork(watchRemoveOrganization),
    fork(watchQuitOrganization),
    fork(watchEditOrganization),
    fork(watchSearchOrganizationInvitations),
    fork(watchCreateOrganizationInvitation),
    fork(watchAcceptOrganizationInvitation),
    fork(watchRejectOrganizationInvitation),
    fork(watchRemoveOrganizationMember),
  ]);
}
