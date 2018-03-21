import React from 'react';

class LogoutdPage extends React.Component {

  componentWillMount() {
    this.props.logout();
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default LogoutdPage;
