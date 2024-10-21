import React from "react";
import ReactDOM from "react-dom";
import {
    createBrowserRouter,
    Link,
    RouterProvider,
} from "react-router-dom";

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

export default class Header extends React.Component {
    menuAnimation() {
        const sidemenu = document.getElementById("sidemenu");
        if(sidemenu.classList.contains("hidden")) {
            sidemenu.classList.remove("slide-out-right")
            sidemenu.classList.remove("hidden");
            sidemenu.classList.add("slide-in-right");
        } else {
            sidemenu.classList.remove("slide-in-right");
            sidemenu.classList.add("hidden");
            sidemenu.classList.add("slide-out-right");
        }
        //menuImg.classList.remove("gelatine_animate");
        //void this.menuImg.offsetWidth;  // forces a reflow
        void sidemenu.offsetWidth;
        //menuImg.classList.add("gelatine_animate");

    }

    render() {
        return (
            <div id="header">
                <div id="logo">
                    <img src={"/img/font_rend.png"} alt={"skillset"}/>
                </div>
                <div id="menu" onClick={this.menuAnimation}>
                    <img src={"/img/menu_stroke.svg"} id="menuimg1" alt=""/>
                    <img src={"/img/menu_stroke.svg"} id="menuimg2" alt=""/>
                    <img src={"/img/menu_stroke.svg"} id="menuimg3" alt=""/>
                </div>
                <div id="sidemenu" className="hidden">
                    <LinkList/>
                </div>
            </div>
        )
    }
}