import React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup }  from 'react-map-gl';
import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const  App = () => {
  // state to hold returned log entries
  const [logEntries, setLogEntries] = useState([]);
  const [addEntry, setAddEntry] = useState(null)
  const [showPopup, setPopup] = useState({});
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: -40.848461,
    longitude: 174.8860,
    zoom: 4.5
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
    console.log(logEntries);
  };

  // Trigger API call with useEffect
  useEffect(() => {
  getEntries();
  }, []);
  /*
 - Render mapGL
 - Retrieve points from API (logEntries)
 - Map points/logEntries with markers
 - add onClick to div rendered by markers, adds { id:Boolean } to showPopUp
 - Controls if popup box is shown
 
  */


  // Adding new Point to db on dbl click
  // double click event contains location lat/long
  const showAddMarkerPopup = (event) => {
    console.log(event);
    const [longitude, latitude, ] = event.lngLat;
    setAddEntry({
    longitude,
    latitude
    });
  }
  return (
    <ReactMapGL
      mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
     

      {logEntries.map(entry => (
      <>
        <Marker 
          key={entry._id}
          longitude={entry.longitude}
          latitude={entry.latitude}

          >
            <div
              onClick={() => {
                setPopup({
                 // ...showPopup,
                  [entry._id]: true
                });
              }}>
          <svg
            className="marker yellow"
            style={{
              // Dynamically set vw vh depending on zoom level
              // Neat!
              height: `${6 * viewport.zoom}px`,
              width: `${6 * viewport.zoom}px`,
            }}
             version="1.1" 
             id="Layer_1"
             x="0px" y="0px" 
             viewBox="0 0 512 512">
            <g>
              <g>
                <path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                        c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                        c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
              </g>
            </g>
          </svg>
          </div>
        </Marker>
        {
          showPopup[entry._id] ? 
          <Popup
              dynamicPosition ={true}
              longitude={entry.longitude}
              latitude={entry.latitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setPopup({
                //...showPopup,
               // [entry._id]: false
              })}
              anchor="top" >
              <div className="popup">
                <h3>{entry.title}</h3>
                 <p>{entry.comments}</p>
                 <p>{entry.description}</p>
                 <img src={entry.image} alt=""></img>
                <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
              </div>
            </Popup>
             :
              null
            }
        </>
      )
     
      )}
    {
      addEntry ? (
        <>
          <Marker
            latitude={addEntry.latitude}
            longitude={addEntry.longitude}
          >
        <div>
              <svg
                className="marker red"
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`,
                }}
                version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
                <g>
                  <g>
                    <path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                      c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                      c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
                  </g>
                </g>
              </svg>
            </div>
          </Marker>
          <Popup
              dynamicPosition ={true}
              longitude={addEntry.longitude}
              latitude={addEntry.latitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setAddEntry(null)}
              anchor="top" >
              <div className="popup">
                <h3>Add Your New Log Entry</h3>
                <LogEntryForm 

                onClose={() => {
                setAddEntry(null);
                getEntries();

              }} location={addEntry} />
              </div>
            </Popup>
        </>
      ) :
      null
    }

    </ReactMapGL>
  );
}

export default App;
