import React from 'react'
import { Link } from 'react-router'

// Need a React class for the wrapper
var Layout = React.createClass({
  // React.cloneElement is needed to pass additional datas to childrens
  // https://github.com/reactjs/react-router/blob/master/upgrade-guides/v1.0.0.md#routehandler
  // http://stackoverflow.com/questions/33741832/react-changing-props-on-grandchildren-object-is-not-extensible-tree-traversin#33746523
  render: function() {
    return (
      <div id="react-wrapper">
        <header className="main-header">
          <ul>
            <li><Link to="/">home</Link></li>
            <li><Link to="/quotations">quotations</Link></li>
          </ul>
        </header>
        <main role="main">
          {React.cloneElement(this.props.children, this.constructor.datas)}
        </main>
      </div>
    );
  }
});

export { Layout as default }
