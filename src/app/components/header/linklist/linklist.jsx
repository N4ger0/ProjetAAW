import React from "react";
import { Link } from "react-router-dom";
import './linklist.css';


export default class Linklist extends React.Component {

    render() {
        const { logged, isAdmin } = this.props;
        console.log("Linklist props logged: " + logged);
        console.log("Linklist props isAdmin: " + isAdmin);
        return (
            <div id="linklist">
                <Link to="/">Menu</Link>
                <p/>
                {logged && (
                    <Link to="/spreedSheet">Spreadsheet</Link>
                )}
                <p/>
                {isAdmin && (
                    <Link to="/administration">Administration</Link>
                )}
                <p/>
            </div>
        );
    }
}