import React from "react";
import Header from "../header/header";
import {Link} from "react-router-dom";
import "./spreadsheet.css"

export default class SpreadSheet extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        skills: [],
        loading: true,
        filterData: "",
      };
    }
  
    componentDidMount() {
      fetch("http://localhost:3000/api/spreadsheet")
        .then((response) => response.json())
        .then((data) => {
          // Vérification que `data` est bien un tableau avant de le stocker dans `skills`
          if (Array.isArray(data)) {
            this.setState({ skills: data, loading: false, filterData: ""});
          } else {
            console.error("Les données reçues ne sont pas un tableau :", data);
            this.setState({ skills: [], loading: false});
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données :", error);
          this.setState({ loading: false , filterData: ""});
        });
    }

    handleSearchChange = (event) => {
      this.setState({filterData: event.target.value});
    };
  
    render() {
      const { skills, loading, filterData} = this.state;
      const dataToShow = skills.filter((row, index) => row[0].toLowerCase().includes(filterData.toLowerCase()));

      return (
        <div>
          <Header/>
            <div id={"content"}>
              {loading ? (
                  <p>Chargement des données...</p>
              ) : (
              <div>
                <form>
                  <label for="site-search">Search :</label>
                  <input type="search" id="site-search" name="q" onChange={this.handleSearchChange} />
                </form>
                  <table border="1">
                  <thead>
                      <tr>
                        <th>Name</th>
                        <th>Discord ID</th>
                        <th>Last update</th>
                        <th>AAW</th>
                        <th>COO</th>
                        <th>Cuisine</th>
                        <th>Sportif</th>
                        <th>Majeur</th>
                        <th>Colonne de merde de Maxime</th>
                      </tr>
                  </thead>
                  <tbody>
                      {dataToShow.map((row, index) => (
                      <tr key={index}>
                        <td> <Link to={"/spreedSheet/"+row[0].replaceAll(' ','_')} > {row[0]} </Link> </td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                        <td>{row[4]}</td>
                        <td>{row[5]}</td>
                        <td>{row[6]}</td>
                        <td>{row[7]}</td>
                        <td>{row[8]}</td>
                      </tr>
                      ))}
                  </tbody>
                  </table>
              </div>)}
            </div>
          </div>
      );
    }
  }