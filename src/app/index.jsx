import React from "react";
import ReactDOM from "react-dom";
import {
    createBrowserRouter,
    Link,
    RouterProvider,
  } from "react-router-dom";

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
                <p>Test</p>
                <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/775dfae9-f9b5-46c9-bcd8-62e7d40ba177/dg8idr3-46121b2a-2beb-4f64-9caa-0d046f39eac0.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzc3NWRmYWU5LWY5YjUtNDZjOS1iY2Q4LTYyZTdkNDBiYTE3N1wvZGc4aWRyMy00NjEyMWIyYS0yYmViLTRmNjQtOWNhYS0wZDA0NmYzOWVhYzAuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.miZMDoaMYjzwzNQZzuwxLvu2wrgaxbdJ_47bCgtl1PU" alt="un petit chat"/>
                <LinkList/>
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

let LinkList = ()=>{
    return <div>
        <nav>
            <ul>
                <li>
                    <Link to="/">test</Link>
                </li>
                <li>
                    <Link to="/spreedSheet">test2</Link>
                </li>
            </ul>
        </nav>
    </div>;
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