// See https://github.com/facebook/create-react-app/issues/5316#issuecomment-496292914
import React from "react";
import * as serviceWorker from "../serviceWorker";

const ServiceWorkerContext = React.createContext();

function ServiceWorkerProvider(props) {
  const [waitingServiceWorker, setWaitingServiceWorker] = React.useState(null);
  const [assetsUpdateReady, setAssetsUpdateReady] = React.useState(false);
  const [assetsCached, setAssetsCached] = React.useState(false);

  const value = React.useMemo(
    () => ({
      assetsUpdateReady,
      assetsCached,
      // Call when the user confirm update of application and reload page
      updateAssets: () => {
        if (waitingServiceWorker) {
          waitingServiceWorker.addEventListener("statechange", event => {
            if (event.target.state === "activated") {
              window.location.reload()
            }
          });

          waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
        }
      }
    }),
    [assetsUpdateReady, assetsCached, waitingServiceWorker]
  );

  // Once on component mounted subscribe to Update and Succes events in 
  // CRA's service worker wrapper
  React.useEffect(() => {
    serviceWorker.register({
      onUpdate: registration => {
        setWaitingServiceWorker(registration.waiting);
        setAssetsUpdateReady(true);
      },
      onSuccess: () => {
        setAssetsCached(true);
      }
    });
  }, []);

  return <ServiceWorkerContext.Provider value={value} {...props} />;
}

function useServiceWorker() {
  const context = React.useContext(ServiceWorkerContext);

  if (!context) {
    throw new Error(
      "useServiceWorker must be used within a ServiceWorkerProvider"
    );
  }

  return context;
}

export { ServiceWorkerProvider, ServiceWorkerContext, useServiceWorker };