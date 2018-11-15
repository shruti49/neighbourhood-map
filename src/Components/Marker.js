import { Component } from 'react';
import PropTypes from 'prop-types'

class Marker extends Component {


  componentDidUpdate(prevProps) {

    if ((this.props.map !== prevProps.map) ||
        (this.props.position !== prevProps.position)) {
        this.renderMarker();
    }
  }
  renderMarker() {
    if (this.marker) {
      this.marker.setMap(null);
    }

    let { map, google, position, bounds, largeInfowindow, onChangeMarker } = this.props;


      let pos = position;
      position = new google.maps.LatLng(pos.lat, pos.lng);

      const pref = {
        map: map,
        position: position
      };
      this.marker = new google.maps.Marker(pref);
      const marker = this.marker;

      let self = this;
      marker.addListener('click', function() {
        self.populateInfoWindow(this, largeInfowindow);
      });

      onChangeMarker(this);

      bounds.extend(marker.position);
      map.fitBounds(bounds);



  }

  populateInfoWindow(marker, infowindow) {

    if (infowindow.marker !== marker) {
      let { map, google, bounds, title } = this.props;

      marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 700);

        infowindow.setContent('Loading...');
        let venueId = null;
        let tipsList = null;
      fetch(`https://api.foursquare.com/v2/venues/search?ll=35.686929,-105.938104&v=20181105&query=${title}&limit=1&client_id=TS1FCZYR2TEYMDGKHBIM1JFG1KPN1NLY4DIZD31B551FZ2IA&client_secret=YVQYDVNG2HDP13VTHX2FGWUPQCUU3A41WVNE34HYE52J5LF2`)
            .then(response => response.json())
            .then(data => {
              venueId = data.response.venues[0].id;
              return fetch(`https://api.foursquare.com/v2/venues/${venueId}/tips?v=20181105&limit=4&client_id=TS1FCZYR2TEYMDGKHBIM1JFG1KPN1NLY4DIZD31B551FZ2IA&client_secret=YVQYDVNG2HDP13VTHX2FGWUPQCUU3A41WVNE34HYE52J5LF2`);
            })
            .then(response => response.json())
            .then(dataTips => {
              tipsList = dataTips;
              return fetch(`https://api.foursquare.com/v2/venues/${venueId}/photos?v=20181105&limit=2&client_id=TS1FCZYR2TEYMDGKHBIM1JFG1KPN1NLY4DIZD31B551FZ2IA&client_secret=YVQYDVNG2HDP13VTHX2FGWUPQCUU3A41WVNE34HYE52J5LF2`);
            })
            .then(response => response.json())
            .then(dataPhotos => addVenuesInfos(tipsList, dataPhotos))
            .catch(err => requestError(err, 'Foursquare'));

            // sucess
            function addVenuesInfos(tipsList, dataPhotos) {
              let htmlResult = '';

              if (tipsList && tipsList.response.tips.items) {
                const tipsData = tipsList.response.tips.items;
                const photosData = dataPhotos.response.photos.items;
                  htmlResult = '<div class="infowindow-content"><h2>' + title + '</h2>';

                  // img
                  htmlResult += '<h3> Images </h3> <div id="photos-places">';
                  for(let i = 0; i < photosData.length; i++) {
                    const photo = photosData[i];
                    htmlResult += `<img alt="${title}, photo ${i + 1} by a visitor" style="width: 30%; margin-right: 5px;" src="${photo.prefix}150x150${photo.suffix}" />`;
                  }

                  // reviews
                  htmlResult += '</div><h3> Helpful Reviews </h3> <ul id="tips-places">';
                  tipsData.forEach( tip => {
                    htmlResult += '<li>' + tip.text + tip.likes.count + ' </li>';
                  })
                  htmlResult += '</ul> <p style="float: right; padding-right: 10px;"><i><small>provided by Foursquare</small></i></p> </div>';
              } else {
                  htmlResult = '<p class="network-warning">Unfortunately, no <i>TIPs</i> was returned for your search.</p>';
              }
              infowindow.setContent(htmlResult);
            }
            // err
            function requestError(err, part) {
              console.log(err);
              infowindow.setContent(`<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
            }
      infowindow.marker = marker;

      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });

      infowindow.open(map, marker);
      map.fitBounds(bounds);
      map.panTo(marker.getPosition());
    }
  }

  render() {
    return null;
  }
}

export default Marker;

Marker.propTypes = {
    map: PropTypes.object
}
