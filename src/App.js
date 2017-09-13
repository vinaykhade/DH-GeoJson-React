import React, {Component} from 'react';
import Geosuggest from 'react-geosuggest';
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import _ from 'underscore';
import Slider from 'react-rangeslider';
import GeoJSON from 'geojson';
import circleToPolygon from 'circle-to-polygon';
import CopyToClipboard from 'react-copy-to-clipboard';
import GeoJsonComponent from './GeoJSON';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      position: [52.50698, 13.391380000000026],
      zoom: 13,
      radius: 2000,
      geoJsonData: null,
      copied: false,
      opts: {
        'readOnly': 'readOnly'
      }
    }
    this.onSuggestSelect = this.onSuggestSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.copyData = this.copyData.bind(this);
  }

  onSuggestSelect(suggest) {
    const { radius } = this.state;
    let position = _.toArray(suggest.location);
    this.generateGeoJSONCircle(position, radius);
    this.setState({
      position,
      copied: false
    })
  }

  handleChange(value) {
    const { position } = this.state;
    this.generateGeoJSONCircle(position, value);
    this.setState({
      radius: value,
      copied: false
    });
  };

  componentDidMount() {
    this.generateGeoJSONCircle([52.50698, 13.39138000000002], 2000);
  }

  copyData() {
    this.setState({copied: true});
  }
  /* Alternate function to get GeoJSON Co-ordinates without directly using google api*/
  generateGeoJson(radius, position) {
    let polygon = circleToPolygon(position, radius, 32);
    var convertToGeo = [
      {
        polygon: [
          polygon.coordinates[0]
        ],

      }
    ];
    var geoJsonData = GeoJSON.parse(convertToGeo, {'Polygon': 'polygon'});
    this.setState({ geoJsonData });
  }

  generateGeoJSONCircle(position, radius) {
    let latlng = new google.maps.LatLng({lat: position[0], lng: position[1]});
    let points = [],
        degreeStep = 360 / 32;

    for(var i = 0; i < 32; i++) {
      let gpos = google.maps.geometry.spherical.computeOffset(latlng, radius, degreeStep * i);
      points.push([gpos.lng(), gpos.lat()]);
    };

    // Duplicate the last point to close the geojson ring
    points.push(points[0]);

    const geo = {
      type: 'Polygon',
      coordinates: [ points ]
    };

    const convertToGeo = [
      {
        polygon: [
          geo.coordinates[0]
        ],

      }
    ];

    const geoJsonData = GeoJSON.parse(convertToGeo, {'Polygon': 'polygon'});
    this.setState({ geoJsonData });
  }

  render() {
    const { radius, geoJsonData, position, copied, opts } = this.state;

    return (
      <div className="container-fluid restaurant-finder--container">
        <div className="row">
          <div className='col-md-6'>
            <div className="address-autosuggest--block">
              <label className="search--label">Search a Restaurant</label>
              <Geosuggest
                onSuggestSelect={this.onSuggestSelect}
                initialValue='Tim Raue, Rudi-Dutschke-Straße, Berlin, Germany'
              />

              <div className="geojson-output--container">
                {
                  /*
                  Convert the Geojson data to string and paste in geojson.io to see the GeoJson.
                  Remove the hide class to see the string format and copy-paste in geojson.io
                  */
                  geoJsonData ?
                  <div className="copy-paste-block">
                    <label>Copy & Paste in </label>
                    <a href="http://geojson.io"  target="_blank"> geojson.io </a>
                    <input
                      type="text"
                      value={JSON.stringify(geoJsonData)}
                       {...opts}
                      className={copied ? 'selected': ''}
                       />
                    <CopyToClipboard text={JSON.stringify(geoJsonData)}
                      onCopy={this.copyData}>
                      <button className="copy-btn">Copy</button>
                    </CopyToClipboard>
                    {
                      copied ?
                      <span className="copied-notify">Copied</span>
                      : null
                    }
                  </div> : null
                }

                <label>Output : </label>
                {
                  geoJsonData ?
                  <GeoJsonComponent geoJsonData={geoJsonData} />
                     : null
              }
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="radius-slider--block">
              <h3>Adjust the radius</h3>
              <Slider
                min={100}
                max={4000}
                value={radius}
                onChange={this.handleChange}
              />
              <div className='radius-block'>
                <label>Radius: </label>
                <span>{radius} m</span>
              </div>
            </div>
            <Map className="geo-map--container" center={position} zoom={this.state.zoom}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              />
              <Circle center={position} radius={radius} color="#FF4E00" />
              <Marker position={position} />
            </Map>
          </div>
        </div>
      </div>

    );
  }
}
export default App;
