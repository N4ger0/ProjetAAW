import React, {useState , useEffect} from "react";
import {redirect, useParams} from "react-router-dom";
import "./spreadsheet.css"
import Header from "../header/header";
import {Button} from 'react';

function SpreadSheetLink() {
    const { name } = useParams();

    const validNote = new RegExp('^\\s*(10|[0-9])\\s*$');

    const validateNote = (note) => {
        // Vérifie avec la regex
        if (!validNote.test(note)) {
            //console.log('Invalid format with regex');
            return false;
        }

        // Convertit en nombre et vérifie les limites
        const number = Number(note.trim()); // Élimine les espaces avant/après
        if (number < 0 || number > 10 || !Number.isInteger(number)) {
            return false;
        }
        return true;
    };

    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`/api/spreadsheet/${name}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error("Erreur de chargement : ", error));
    }, [name]);

    const changeData = async () => {
        setboutonEnabled(true);
        const discord_id = data[0][1];
        const updatedName = newName === '' ? data[0][0] : newName;
        const updatedAAW = newAAW === '' || !validateNote(newAAW) ? data[0][3] : newAAW;
        const updatedCOO = newCOO === '' || !validateNote(newCOO) ? data[0][4] : newCOO;
        const updatedCuisine = newCuisine === '' || !validateNote(newCuisine) ? data[0][5] : newCuisine;
        const updatedSportif = newSportif === '' || !validateNote(newSportif) ? data[0][6] : newSportif;
        const updatedMajeur = newMajeur === '' || !validateNote(newMajeur) ? data[0][7] : newMajeur;
    
        try {
            const response = await fetch('http://localhost:3000/api/spreadsheet/change', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    discord_id,
                    name: updatedName,
                    aaw: updatedAAW,
                    coo: updatedCOO,
                    cuisine: updatedCuisine,
                    sportif: updatedSportif,
                    majeur: updatedMajeur,
                }),
            });    
            if (response.ok) {
                console.log('Fonction exécutée avec succès');

            } else {
                console.error('Erreur lors de l\'exécution');
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
        }
        setboutonEnabled(false);
        window.location.reload();
    };

    const [newName, setnewName] = useState('');
    const [newAAW, setnewAAW] = useState('');
    const [newCuisine, setnewCuisine] = useState('');
    const [newCOO, setnewCOO] = useState('');
    const [newSportif, setnewSportif] = useState('');
    const [newMajeur, setnewMajeur] = useState('');
    const [boutonEnabled, setboutonEnabled] = useState(false);


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
                      <td> <input type="text" onChange={e => setnewName(e.target.value)}/> </td>
                      <td> </td>
                      <td> </td>
                      <td> <input type="text" maxLength="2" size="2" onChange={e => setnewAAW(e.target.value)}/> </td>
                      <td> <input type="text" maxLength="2" size="2" onChange={e => setnewCOO(e.target.value)}/> </td>
                      <td> <input type="text" maxLength="2" size="2" onChange={e => setnewCuisine(e.target.value)}/> </td>
                      <td> <input type="text" maxLength="2" size="2" onChange={e => setnewSportif(e.target.value)}/> </td>
                      <td> <input type="text" maxLength="2" size="2" onChange={e => setnewMajeur(e.target.value)}/> </td>
                    </tr>
                </tbody>
                </table>
                <button onClick={changeData} disabled={boutonEnabled}>Actualiser les données</button>
            </div>
            )}
            </div>
        </div>
    );
}

export default SpreadSheetLink;