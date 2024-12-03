import React, { useEffect, useState, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter, Navigate,
    RouterProvider,
} from "react-router-dom";
import Header from "./components/header/header";
import dotenv from "dotenv";
import Authsuccess from "./components/auth/authsuccess";
import './index.css';
import SpreadSheet from "./components/spreadsheet/spreadsheet";
import SpreadSheetLink from "./components/spreadsheet/spreasheetLink";
import PageNotFound from "./components/not_found/PageNotFound";

dotenv.config();

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function Application() {
    const { logged, setLogged } = useAuth();

    return (
        <div>
            <Header logged={logged} setLogged={setLogged} />
            <div id="content">
                <div id="div_stock">
                    <h1>Managez les skills de votre équipe !</h1>
                </div>
                <div id={"div_first_text"}>
                    <b>Chez Skillset, nous croyons qu'une équipe compétente est la clé de tout succès !</b>
                </div>
                <img src={"/img/rectangle.svg"} alt={"rectangle"} />
            </div>
        </div>
    );
}

function AppWrapper() {
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('/api/isLogged', {
                    method: 'GET',
                    credentials: 'same-origin',
                });
                const data = await response.json();
                setLogged(data.isLogged);
            } catch (error) {
                console.error('Error checking login status:', error);
                setLogged(false);
            }
        };
        checkLoginStatus();
    }, []);

    const authValue = { logged, setLogged };

    return (
        <AuthContext.Provider value={authValue}>
            <RouterProvider router={router} />
        </AuthContext.Provider>
    );
}

function ProtectedRoute({ children }) {
    const { logged } = useAuth();

    if (!logged) {
        return <Navigate to="/" />;
    }
    return children;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Application />,
    },
    {
        path: "/spreedSheet",
        element: (
            <ProtectedRoute>
                <SpreadSheet/>
            </ProtectedRoute>
        ),
    },
    {
        path: "/auth/discord/callback",
        element: <Authsuccess />,
    },
    {
        path: "/spreedSheet/:name",
        element: (
            <ProtectedRoute>
                <SpreadSheetLink/>
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <PageNotFound />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AppWrapper />
    </React.StrictMode>
);