import "./administration.css"
import Header from "../header/header";
import {useEffect, useState} from "react";

function Administration() {

    const [ data, setData ] = useState(null) ;

    useEffect(() => {
        fetch("/api/admin/info")
            .then(res => res.json())
            .then(data => setData(data))
            .then(() => console.log(data))
            .catch(error => console.log(error))
    }, []);

    function deconnectUser(discord_id) {
        fetch(`api/admin/disconnect/${discord_id}`)
            .then(response => response.text())
            .then(data => {
                if(data === "ok") {
                    fetch("/api/admin/info")
                        .then(res => res.json())
                        .then(data => setData(data))
                        .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <div>
            <Header/>
            <div id={"content"}>
            { data !== null ? (
                <table>
                    {data.map((row, rowindex) => (
                         rowindex === 0 ? (
                        <thead>
                            <tr>
                                {row.map((row2) => (
                                    <th> {row2} </th>
                                ))}
                                <th> Deconnecter </th>
                            </tr>
                        </thead>
                         ) : (
                         <tbody>
                             <tr>
                                 {row.map((row2) => (
                                     <th> {row2} </th>
                                 ))}
                                 <th> <button onClick={() => {deconnectUser(row[0])}}>Deconnecter</button></th>
                             </tr>
                        </tbody>
                        )
                    ))}
                </table>
            ) : null }
            </div>
        </div>
    )
}

export default Administration;