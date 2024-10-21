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

    gelatineAnimation() {
        const menuImg = document.getElementById("menuimg");
        const sidemenu = document.getElementById("sidemenu");
        if(sidemenu.classList.contains("hidden")) {
            sidemenu.classList.remove("bounce-out-right");
            sidemenu.classList.remove("hidden");
            sidemenu.classList.add("bounce-in-right");
        } else {
            sidemenu.classList.remove("bounce-in-right");
            sidemenu.classList.add("hidden");
            sidemenu.classList.add("bounce-out-right");
        }
        menuImg.classList.remove("gelatine_animate");
        void menuImg.offsetWidth;  // forces a reflow
        void sidemenu.offsetWidth;
        menuImg.classList.add("gelatine_animate");

    }

    render() {
        return(
            <div>
                <Header></Header>
                <p>Test</p>
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