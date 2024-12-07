import React, {useEffect} from "react";
import './header.css';
import { Link } from "react-router-dom";
import Auth from "../auth/auth";
import Linklist from "./linklist/linklist";
import { useAuth } from "../../index";

function Header() {
    const { logged, setLogged } = useAuth();

    const menuAnimation = () => {
        const sidemenu = document.getElementById("sidemenu");
        const menu = document.getElementById("menu");

        if (sidemenu.classList.contains("hidden")) {
            sidemenu.classList.remove("slide-out-right");
            sidemenu.classList.remove("hidden");
            sidemenu.classList.add("slide-in-right");
            menu.classList.add("cross");
        } else {
            sidemenu.classList.remove("slide-in-right");
            menu.classList.remove("cross");
            sidemenu.classList.add("slide-out-right");
        }

        // Force reflow for smooth animation
        void menu.offsetWidth;
        void sidemenu.offsetWidth;
    };

    useEffect(() => {
        const sidemenu = document.getElementById("sidemenu");
        sidemenu.addEventListener('animationend', function handleAnimationEnd() {
            if (sidemenu.classList.contains("slide-out-right")) {
                sidemenu.classList.add("hidden");
            }
        });
    }, []);

    console.log("Header props is connected : " + logged);

    return (
        <div id="header">
            <div id="logo">
                <img src={"/img/font_rend.png"} alt={"skillset"} />
            </div>
            <div id="menu" onClick={menuAnimation}>
                <img src={"/img/menu_stroke.svg"} id="menuimg1" alt="" />
                <img src={"/img/menu_stroke.svg"} id="menuimg2" alt="" />
                <img src={"/img/menu_stroke.svg"} id="menuimg3" alt="" />
            </div>
            <div id="sidemenu" className="hidden">
                <Linklist logged={logged} />
                <Auth setLogged={setLogged} />
            </div>
        </div>
    );
}

export default Header;