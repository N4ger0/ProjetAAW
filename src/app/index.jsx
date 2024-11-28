import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Header from "./components/header/header"
import dotenv from "dotenv";
import Authsuccess from "./components/auth/authsuccess";
import './index.css'
import SpreadSheet from "./components/spreadsheet/spreadsheet";
import SpreadSheetLink from "./components/spreadsheet/spreasheetLink";
import PageNotFound from "./components/not_found/PageNotFound";

dotenv.config();

class Application extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            logged : false
        }
    }

    setLogged = (value) => {
        this.setState({ logged: value });
    }

    render() {
        return(
            <div>
                <Header logged={this.state.logged} setLogged={this.setLogged}></Header>
                <div id="content">
                    <div id="div_stock">
                        <h1> Managez les skills de votre équipe !</h1>
                    </div>
                    <div id={"div_first_text"}>
                        <b>Chez Skillset, nous croyons qu'une équipe compétente est la clé de tout succès !</b>
                    </div>
                    <img src={"/img/rectangle.svg"} alt={"rectangle"}></img>
                </div>
            </div>
        );
    }
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Application />,
    },
    {
        path: "/spreedSheet",
        element: <SpreadSheet/>,
    },
    {
        path: "/auth/discord/callback",
        element: <Authsuccess/>,
    },
    {
        path: "/spreedSheet/:name",
        element: <SpreadSheetLink/>,
    },
    {
        path: "*",
        element: <PageNotFound/>
    }
  ]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);