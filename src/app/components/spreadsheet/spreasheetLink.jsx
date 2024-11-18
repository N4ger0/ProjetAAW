import React, {useState , useEffect} from "react";
import {useParams} from "react-router-dom";
import "./spreadsheet.css"
import Header from "../header/header";

function SpreadSheetLink() {
    const { name, note } = useParams();

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
                <p> Note : {note}</p>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
}

export default SpreadSheetLink;