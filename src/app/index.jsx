import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    Link,
    RouterProvider,
  } from "react-router-dom";
import Header from "./header"

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
                        <img src={"/img/stock.jpg"} alt={""}/>
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
  ]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);