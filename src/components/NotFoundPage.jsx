import React from "react";
import "./NotFoundPage.css";

export const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <p>Этой страницы не существует</p>
            <button onClick={() => window.location.href = "/"}>На главную</button>
        </div>
    )
}