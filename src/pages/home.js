import React, { useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import jwtDecode from "jwt-decode";

const unityContext = new UnityContext({
    loaderUrl: "build/Build/build.loader.js",
    dataUrl: "build/Build/build.data",
    frameworkUrl: "build/Build/build.framework.js",
    codeUrl: "build/Build/build.wasm",
    streamingAssetsUrl: "build/StreamingAssets",
});

function Home() {
    useEffect(() => {
        unityContext.on("Connect", function () {
            console.log("Connection require");
        });
    }, []);


    useEffect(function () {
        unityContext.on("GameReady", function (message) {
            console.log("message", message)
            if (message == "Ready") {
                try {

                    // console.log({
                    //     IP: process.env.REACT_APP_SERVER_IP,
                    //     port: process.env.REACT_APP_SERVER_PORT,
                    //     sslEnabled: process.env.REACT_APP_SSL == 1
                    // });

                    // unityContext.send("CrashController", "setNewSocket", JSON.stringify({
                    //     IP: process.env.REACT_APP_SERVER_IP,
                    //     port: process.env.REACT_APP_SERVER_PORT,
                    //     sslEnabled: process.env.REACT_APP_SSL == 1
                    // }));

                    window.onmessage = (e) => {
                        if (e.data.name === "iframe_message") {
                            let user = jwtDecode(e.data.token);
                            unityContext.send("CrashController", "RequestToken", JSON.stringify({
                                userName: user.name,
                                token: e.data.token,
                                amount: e.data.allowanceAmount
                            }));
                        }
                    }
                    window.parent.postMessage({ name: "iframe_message" }, "*");
                } catch (err) {
                    console.log("error", err);
                }
            }
            else console.log("error");
        });
    }, []);

    return (
        <div>
            <Unity
                unityContext={unityContext}
                matchWebGLToCanvasSize={true}
                style={{ height: "100vh" }}
            />
        </div>
    );
}

export default Home