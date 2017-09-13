import React from 'react';
import _ from 'underscore';

const GeoJsonComponent = function(props) {

  const geoJsonData = props.geoJsonData;

  return(
    <div className="geojson--container">
      <div>&#x7b;</div>
      <div className="margin-left-one-tab"><span className="object-key">"type": </span> {geoJsonData.type},</div>
      <div className="margin-left-one-tab"><span className="object-key">"features": </span>[</div>
        <div className="margin-left-one-tab">
          <div className="margin-left-one-tab">&#x7b;</div>
          <div className="margin-left-one-tab">
            <div className="margin-left-one-tab"><span className="object-key">"type":</span> {geoJsonData.features[0].type},</div>
            <div className="margin-left-one-tab"><span className="object-key">"properties": </span>&#x7b; &#x7D; ,</div>
            <div className="margin-left-one-tab"><span className="object-key">"geometry": </span>&#x7b; </div>
              <div className="margin-left-one-tab">
                <div className="margin-left-one-tab"><span className="object-key">"type": </span>{geoJsonData.features[0].geometry.type},</div>
                <div className="margin-left-one-tab"><span className="object-key">"coordinates": </span>[</div>
                  <div className="margin-left-one-tab">
                    <div className="margin-left-one-tab">[</div>
                      <div className="margin-left-one-tab">
                        {
                          _.map(geoJsonData.features[0].geometry.coordinates[0], (cord, key) =>{
                            return(
                              <div key={key} className="margin-left-one-tab">
                                <div>[</div>
                                  <div className="margin-left-one-tab coordinate-value">{cord[0]} ,</div>
                                  <div className="margin-left-one-tab coordinate-value">{cord[1]}</div>
                                <div>] ,</div>
                              </div>
                            )
                          })
                        }
                      </div>
                    <div className="margin-left-one-tab">]</div>
                  </div>
                <div className="margin-left-one-tab">]</div>
              </div>
            <div className="margin-left-one-tab">&#x7D;</div>
          </div>
          <div className="margin-left-one-tab">&#x7D;</div>
        </div>
      <div className="margin-left-one-tab">]</div>
      <div>&#x7D;</div>
    </div>
  )
}

export default GeoJsonComponent;
