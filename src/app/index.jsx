import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    Link,
    RouterProvider,
  } from "react-router-dom";
import Header from "./components/header/header"
import dotenv from "dotenv";
import Authsuccess from "./components/auth/authsuccess";
import './index.css'

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
                        <h1> Managez les skills de votre équipe !</h1>
                    </div>
                </div>
            </div>
        );
    }
}

class SpreedSheet extends React.Component {

    render() {
        return(
            <div>
                <p>Test 2</p>
                <LinkList/>
            </div>
        )
    }
}



const router = createBrowserRouter([
    {
      path: "/",
      element: <Application />,
    },
    {
      path: "/spreedSheet",
      element: <SpreedSheet/>,
    },
    {
        path: "/auth/discord/callback",
        element: <Authsuccess/>,
    }
  ]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);