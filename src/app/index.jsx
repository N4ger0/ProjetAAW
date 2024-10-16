import React from "react";
import ReactDOM from "react-dom";

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
        }
    }

    render() {
        return(<p>Test</p>) ;
    }
}

ReactDOM.render(<Application/>, document.getElementById("root")) ;