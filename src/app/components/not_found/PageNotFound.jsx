import React from "react";
import Header from "../header/header";
import "./not_found.css";

export default class PageNotFound extends React.Component {
    render() {
        return(
            <div>
                <Header/>
                <div id={"content"} className={"not_found"}>
                    <h1>Erreur 404</h1>
                    <img src={"/img/logo_sad.png"} alt={""}/>
                    <p> Nous n'avons pas trouvés la page que vous cherchez !</p>
                </div>
            </div>
        )
    }
}