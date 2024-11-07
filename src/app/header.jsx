import React from "react";
import ReactDOM from "react-dom";
import {
    createBrowserRouter,
    Link,
    RouterProvider,
} from "react-router-dom";
import Auth from "./auth"

let LinkList = ()=>{
    return <div>
        <nav>
            <ul>
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
        const menu = document.getElementById("menu");
        if(sidemenu.classList.contains("hidden")) {
            sidemenu.classList.remove("slide-out-right")
            sidemenu.classList.remove("hidden");
            sidemenu.classList.add("slide-in-right");
            menu.classList.add("cross");
        } else {
            sidemenu.classList.remove("slide-in-right");
            menu.classList.remove("cross");
            sidemenu.classList.add("hidden");
            sidemenu.classList.add("slide-out-right");
        }
        //menuImg.classList.remove("gelatine_animate");
        void menu.offsetWidth;  // forces a reflow
        void sidemenu.offsetWidth;

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
                    <Auth logged={this.props.logged} setLogged={this.props.setLogged}></Auth>
                    <LinkList/>
                </div>
            </div>
        )
    }
}