import "./administration.css"
import Header from "../header/header";
import {useEffect, useState} from "react";

function Administration() {

    const [ data, setData ] = useState(null) ;

    useEffect(() => {
        fetch("/api/adminInfo")
            .then(res => res.json())
            .then(data => setData(data))
            .then(() => console.log(data))
            .catch(error => console.log(error))
    }, []);

    return (
        <div>
            <Header/>
            <div id={"content"}>
            { data !== null ? (
                <table>
                    <thead>
                        <tr>
                            <th> Discord id</th>
                            <th> Username </th>
                            <th> Expires in</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.map((row) => (
                        <tr>
                            <th> {row.data.discord_id } </th>
                            <th> {row.data.global_name} </th>
                            <th> {row.expires} </th>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : null}
            </div>
        </div>
    )
}

export default Administration;