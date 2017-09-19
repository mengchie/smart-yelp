import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './gmap.css';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import SearchBox from 'react-google-maps/lib/places/SearchBox';
import blueMarker from '../blueMarker.png';
const google = window.google;

const INPUT_STYLE = {
  boxSizing: `border-box`,
  MozBoxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  marginTop: `27px`,
  padding: `0 12px`,
  borderRadius: `1px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
};
const sess = [];
const sessN = {};
// const updater = null;

const SearchBoxExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={ props.onBoundsChanged }
    onDragEnd={ props.onCenterChanged }
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputPlaceholder="go search..."
      inputStyle={INPUT_STYLE}
    />
    {props.markers.map((marker, index) => (
      <Marker 
      	position={marker.position}
       	icon={marker.icon} 
       	key={index}
       	onClick={() => {
       		if(sess.indexOf(marker.sessionId) == -1){
       			sess.push(marker.sessionId);
       			sessN[marker.sessionId] = marker.name;
       			marker.this.setState({sessions: sess});
       			marker.this.setState({sessNames: sessN});
       			console.log(marker.this.state.sessions);
       			marker.this.props.setSession();
       		}
       	}}
      >
      	{marker.showInfo && (
          <InfoWindow>
            <div>{marker.name}</div>
          </InfoWindow>
        )}
      </Marker>
    ))}
    
  </GoogleMap>
));
const INITIAL_CENTER = { lat: 25.0214858, lng: 121.5312979 };

class Gmap extends Component {

	componentDidMount() {

  	}

	state = {
  	  bounds: null,
  	  center: INITIAL_CENTER,
  	  markers: [],
  	  sessions: [],
  	  sessNames: {}
  	};

  handleMapMounted = this.handleMapMounted.bind(this);
  handleBoundsChanged = this.handleBoundsChanged.bind(this);
  handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
  handleCenterChanged = this.handleCenterChanged.bind(this);
  handlePlacesChanged = this.handlePlacesChanged.bind(this);
  // setMarksSessions = this.setMarksSessions.bind(this);

  handleMapMounted(map) {
    this._map = map;
    this.handleBoundsChanged();
  }

  handleBoundsChanged() {
  	console.log('in Bounds change');
    this.setState({
      bounds: this._map.getBounds(),
      center: this._map.getCenter(),
    });

    if(this.props.targetMarker.name === undefined) {
    	console.log('in center change targetMarker === 0');
    	return
    } 
    if(this.props.targetMarker !== this.props.cancelMarker) {
    	console.log('in center change position changed...');

    	if(this.props.targetMarker.showInfo === false) {
    		this.setState({
    		  markers: this.state.markers.map(marker => {
    		    if (marker === this.props.targetMarker) {
    		      return {
    		        ...marker,
    		        showInfo: true,
    		      };
    		    }
    		    return marker;
    		  }),
    		});
    	}

    } else {
    	console.log('same position')
    	return
    }
  }

  handleSearchBoxMounted(searchBox) {
    this._searchBox = searchBox;
    // console.log(searchBox);
  }


  handleCenterChanged() {
  	this.handlePlacesChanged();
  	
  }

  // setMarksSessions(sessionId) {
  // 	let oldSessions = this.state.sessions;
  // 	oldSessions.push(sessionId);
  // 	this.setState({
  // 		sessions: oldSessions
  // 	});
  // }


  handlePlacesChanged() {
  	// let x = this;
    const places = this._searchBox.getPlaces();
    if(places === undefined) return
    console.log(places);
    // Add a marker for each place returned from search bar
    const markers = places.map(place => ({
      map: this._map,
      rate: place.rating,
      showInfo: false,
      name: place.name,
      this: this,
      position: place.geometry.location,
      sessionId: place.id,
      image: place.photos? place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400}) : place.icon,
      address: place.formatted_address
    }));
    // console.log(markers);

    // Set markers; set map center to first search result
    const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;
    this.props.setMarkersInApp(markers);

    this.setState({
      center: mapCenter,
      markers,
    });

    // console.log(markers);
  }


    render() {
    	// const markers = this.props.markers || [];
    	return (
    		<SearchBoxExampleGoogleMap 
    	  	  containerElement={
    	  	    <div className="mapContainer" />
    	  	  }
    	  	  mapElement={
    	  	    <div  style={{ height: `100%` , width: `100%`}} />
    	  	  }
    	  	  // center={this.state.center}
    	  	  onMapMounted={this.handleMapMounted}
    	  	  onBoundsChanged={this.handleBoundsChanged}
    	  	  onSearchBoxMounted={this.handleSearchBoxMounted}
    	  	  bounds={this.state.bounds}
    	  	  onPlacesChanged={this.handlePlacesChanged}
    	  	  onCenterChanged={this.handleCenterChanged}
    	  	  markers={this.state.markers}

    	  	  center={this.props.targetMarker.position || this.state.center}
        	  targetMarker={this.props.targetMarker}

    	  	/>
    	);
 	}
}


export default Gmap;

