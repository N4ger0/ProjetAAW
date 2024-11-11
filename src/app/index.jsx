import React, { useState } from "react";
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
    constructor(props) {
        super(props);
        this.state = {
          data: []
        };
    }

    componentDidMount() {
        fetch("http://localhost:3000/getSpreedSheetData")
            .then((response) => response.json())
            .then((data) => this.setState({ data }))
            .catch((error) => console.error("Erreur lors de la récupération des données :", error));
    }

    render() {
        const { data } = this.state;
        
        return(
            <div>
                <Header></Header>
                <table border="1">
                  <thead>
                    <tr>
                      <th>Jeu</th>
                      <th>Note</th>
                      <th>Avis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                      </tr>))}
                 </tbody>
                </table>
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