import React from 'react';
import { Link } from 'react-router-dom';
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Game.module.css'

export default function Game() {
    const { unityProvider } = useUnityContext({
        loaderUrl: "/NetGenius/KeysQuiz.loader.js",
        dataUrl: "/NetGenius/KeysQuiz.data",
        frameworkUrl: "/NetGenius/KeysQuiz.framework.js",
        codeUrl: "/NetGenius/KeysQuiz.wasm",
    });

    return (
        <div className={styles.gameWindow}>
            <Unity unityProvider={unityProvider} style={{ width: 1920, height: 1080 }} />
        </div>
    );
}