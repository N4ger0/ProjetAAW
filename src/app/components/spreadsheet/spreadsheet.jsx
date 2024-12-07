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
                  <input type="search" id="site-search" name="q" placeholder="Rechercher" onChange={this.handleSearchChange} />
                </form>
                  <table border="1">
                  <thead>
                      <tr>
                          {dataToShow[0].map((row) => (
                              <th>{row}</th>
                              )
                          )}
                      </tr>
                  </thead>
                  <tbody>
                      {dataToShow.map((row, index) => (
                          index!==0 ? (
                              <tr key={index}>
                                  {row.map((cell, index2) => (
                                      index2===0 ? (
                                          <td><Link to={"/spreedSheet/" + cell.replaceAll(' ', '_')}> {cell} </Link></td>
                                      ) : (<td>{cell}</td>)
                                      )
                                  )}
                              </tr>
                          ) : null
                      ))}
                  </tbody>
                  </table>
              </div>)}
            </div>
        </div>
      );
    }
}