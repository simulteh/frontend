import React, { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function Game() {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "/NetGenius/BuildNetGenius.loader.js",
    dataUrl: "/NetGenius/BuildNetGenius.data",
    frameworkUrl: "/NetGenius/BuildNetGenius.framework.js",
    codeUrl: "/NetGenius/BuildNetGenius.wasm",
  });

  return (
    <Fragment>
      {!isLoaded && (
        <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ visibility: isLoaded ? "visible" : "hidden", width: "90%", height: "90%" }}
      />
    </Fragment>
  );
}

export default Game;
