import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Header from "./header"
import dotenv from "dotenv";
import Authsuccess from "./authsuccess";
import SpreadSheet from "./spreadsheet";
import SpreadSheetLink from "./spreasheetLink";

dotenv.config();

class Application extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
        }
    }

    render() {
        return(
            <div>
                <Header></Header>
                <div id="content">
                    <div id="div_stock">
                        <b> Managez les skills de votre équipe !</b>
                    </div>
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
    }
  ]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);