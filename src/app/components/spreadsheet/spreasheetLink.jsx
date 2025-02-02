import React, {useState , useEffect} from "react";
import {redirect, useParams} from "react-router-dom";
import "./spreadsheet.css"
import Header from "../header/header";

function SpreadSheetLink() {
    let { name } = useParams();

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

    useEffect( () => {
        fetch(`/api/spreadsheet/${name}`)
            .then(response => response.json())
            .then(res => setData(res))
            .catch(error => console.error("Erreur de chargement : ", error));
    }, [name]);

    useEffect(() => {
        if (data && data[1] && data[1][1]) {
            fetch(`/api/spreadsheet/canModify/${data[1][1]}`)
                .then(response => response.json())
                .then(pasdata => setcanModify(pasdata))
                .then(() => console.log(canModify))
                .catch(error => console.error("Erreur lors de l'appel à canModify : ", error));
        }
    }, [data]);

    const buildBodyJson = () => {
        let result = [] ;
        let valid = true ;
        for (let i = 0; i < data[0].length; i++) {
            if(i == 1) { //discord id
                result.push(data[1][i]) ;
                continue ;
            }
            if(i == 2) {
                const today = new Date();
                const actualDate = today.toLocaleString("fr-FR");
                result.push(actualDate) ;
                continue ;
            }
            if(newvalues[i] != null){
                if(!validateNote(newvalues[i])) {
                    window.alert("La note saisie doit être un entier compris entre 0 et 10.")
                    valid = false ;
                    break ;
                }
                result.push(newvalues[i]);
            }
            else {
                result.push(data[1][i]);
            }
        }
        console.log(result)
        return [ result, valid ];

    }

    const changeData = async () => {
        setboutonEnabled(true);
        let [ result, valid ] = buildBodyJson() ;
        console.log(result)
        if(valid === true) {
            try {
                console.log("dans le try")
                const response = await fetch('http://localhost:3000/api/spreadsheet/change', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(result),
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
            fetch(`/api/spreadsheet/${name}`)
                .then(response => response.json())
                .then(res => setData(res))
                .catch(error => console.error("Erreur de chargement : ", error));
            setData(data);
            let restables = document.getElementsByClassName('resetable') ;

            for(let i = 0 ; i < restables.length; i++) {
                restables[i].value = "" ;
            }
            return ;
        }
        setboutonEnabled(false);
    };

    const [newvalues, setnewvalues] = useState([]);
    const [boutonEnabled, setboutonEnabled] = useState(false);
    let [canModify, setcanModify] = useState(false) ;


    return(
        <div>
            <Header/>
            <div id={"content"}>
                <h1>Page de {name.replaceAll('_', ' ')}</h1>
                {!data ? (
                <p>Chargement des données...</p>
            ) : (
            <div>
                <table border="1">
                <thead>
                    <tr key="0">
                        {data[0].map((row) => (
                            <th>{row}</th>
                        ))}
                    </tr>
                </thead>
                    <tbody>
                    <tr key="1">
                        {data[1].map((row) => (
                            <td>{row}</td>
                    ))}
                    </tr>
                    { canModify.canModify === true ? (
                    <tr key="2">
                        {data[0].map((row, index) => (
                            index == 1 || index == 2 ? ( <td></td>)
                                : (<td><input type={"text"} className={"resetable"} onChange={e => newvalues[index] = e.target.value}/></td>)
                        ))}
                    </tr> ) : null }
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