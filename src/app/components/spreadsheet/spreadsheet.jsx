import React from "react";
import Header from "../header/header";
import {Link} from "react-router-dom";
import "./spreadsheet.css"

export default class SpreadSheet extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        skills: [], // Initialisation en tant que tableau
        loading: true,
      };
    }
  
    componentDidMount() {
      fetch("http://localhost:3000/api/spreadsheet")
        .then((response) => response.json())
        .then((data) => {
          // Vérification que `data` est bien un tableau avant de le stocker dans `skills`
          if (Array.isArray(data)) {
            this.setState({ skills: data, loading: false });
          } else {
            console.error("Les données reçues ne sont pas un tableau :", data);
            this.setState({ skills: [], loading: false });
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données :", error);
          this.setState({ loading: false });
        });
    }
  
    render() {
      const { skills, loading } = this.state;
  
      return (
        <div>
          <Header/>
            <div id={"content"}>
            {loading ? (
                <p>Chargement des données...</p>
            ) : (
                <table border="1">
                <thead>
                    <tr>
                    <th>Jeu</th>
                    <th>Note</th>
                    <th>Avis</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map((row, index) => (
                    <tr key={index}>
                        <td> <Link to={"/spreedSheet/"+row[0].replaceAll(' ','_') + "/" + row[1]} > {row[0]} </Link> </td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
            </div>
        </div>
      );
    }
  }