import React from "react";
import Helmet from "react-helmet";

function App(props) {
  return (
    <div>
      <Helmet
        titleTemplate="%s - "
        defaultTitle=""
        meta={[
          {name: "description", content: ""},
        ]}
      />
      {React.Children.toArray(props.children)}
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
