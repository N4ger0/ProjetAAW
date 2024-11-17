import React, {useState , useEffect} from "react";
import {useParams} from "react-router-dom";

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
            <h1>Page de {name}</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default SpreadSheetLink;