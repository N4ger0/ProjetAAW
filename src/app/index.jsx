import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    Link,
    RouterProvider,
  } from "react-router-dom";
import Header from "./header"
import dotenv from "dotenv";
import Authsuccess from "./authsuccess";

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


class SpreedSheet extends React.Component {

    render() {
        return(
            <div>
                <Header></Header>
                <p>Test 2</p>
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