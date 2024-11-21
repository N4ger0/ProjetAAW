import React, {useState , useEffect} from "react";
import {useParams} from "react-router-dom";
import "./spreadsheet.css"
import Header from "../header/header";

function SpreadSheetLink() {
    const { name } = useParams();

    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`/api/spreadsheet/${name}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error("Erreur de chargement : ", error));
    }, [name]);
    
    return(
        <div>
            <Header/>
            <div id={"content"}>
                <h1>Page de {name}</h1>
                {!data ? (
                <p>Chargement des données...</p>
            ) : (
            <div>
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
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>{row[3]}</td>
                      <td>{row[4]}</td>
                      <td>{row[5]}</td>
                      <td>{row[6]}</td>
                      <td>{row[7]}</td>
                    </tr>
                    ))}
                    <tr>
                      <td> <input type="text" id="changeZone_1"/> </td>
                      <td> </td>
                      <td> </td>
                      <td> <input type="text" id="changeZone_4" maxlength="2"pattern="\d{4,4}" size="2"/> </td>
                      <td> <input type="text" id="changeZone_5" maxlength="2"pattern="\d{4,4}" size="2"/> </td>
                      <td> <input type="text" id="changeZone_6" maxlength="2"pattern="\d{4,4}" size="2"/> </td>
                      <td> <input type="text" id="changeZone_7" maxlength="2"pattern="\d{4,4}" size="2"/> </td>
                      <td> <input type="text" id="changeZone_8" maxlength="2"pattern="\d{4,4}" size="2"/> </td>
                    </tr>
                </tbody>
                </table>
                <button type="button" >Valider les changements</button>
            </div>
            )}
            </div>
        </div>
    );
}

export default SpreadSheetLink;