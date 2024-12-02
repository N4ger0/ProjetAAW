import React, {useState , useEffect} from "react";
import {redirect, useParams} from "react-router-dom";
import "./spreadsheet.css"
import Header from "../header/header";
import {sheets} from "googleapis/build/src/apis/sheets";

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

    const buildBodyJson = () => {
        let result = [] ;
        for (let i = 0; i < data[0].length; i++) {
            if(i == 1) { //discord id
                result.push(data[1][i]) ;
                continue ;
            }
            if(i == 2) {
                const today = new Date();
                const actualDate = today.getMonth()+'/'+today.getDay()+'/'+today.getFullYear()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
                result.push(actualDate) ;
            }
            if(newvalues[i] != null){
                result.push(newvalues[i]);
            }
            else {
                result.push(data[1][i]);
            }
        }
        return result ;
    }

    const changeData = async () => {
        setboutonEnabled(true);
        let body = buildBodyJson() ;
        try {
            const response = await fetch('http://localhost:3000/api/spreadsheet/change', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
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
    

    const [newvalues, setnewvalues] = useState([]);
    const [boutonEnabled, setboutonEnabled] = useState(false);
        
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
                    <tr key="2">
                        {data[1].map((row, index) => (
                            index == 1 || index == 2 ? ( <td></td>)
                                : (<td><input type={"text"} onChange={e => newvalues[index] = e.target.value}/></td>)
                        ))}
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