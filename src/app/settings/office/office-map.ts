import {Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild} from '@angular/core';
import './office_map.css';
declare var google:any;

const template = `
    <div class="pac-card" id="pac-card">
        <div>
            <div id="title">
                Office Address
            </div>
            &nbsp;
        </div>

        <div id="pac-container">
            <input 
                id="pac-input" type="text" 
                name="_office_address_string" 
                [(ngModel)]="_office_address_string" 
                placeholder="Enter a location"
            />
        </div>

    </div>    
    <div #map style="height: 400px; margin-bottom: 15px"></div>
`;

@Component({
    selector: 'office-map',
    template: template
})
export class OfficeMap {

    @ViewChild('map')
    mapElRef:ElementRef;

    _latLng:any = {};
    _office_address_string:string = "";

    public map:any;

    public marker;

    @Input()

    public set latLng(val){
        this._latLng = val;
        if(this.islatLngSet()) this.placeMarker(val);
    };
    public get latLng(){
        return this._latLng;
    }

    @Input()
    public set office_address_string(val){
        this._office_address_string = val;
    }
    public get office_address_string(){
        return this._office_address_string;
    }

    @Output()
    public onSelect = new EventEmitter();

    ngAfterViewInit(){
        var el = this.mapElRef.nativeElement;
        var pos = {lat: 30.3753, lng: 69.3451};
        this.map = new google.maps.Map(el, {
            zoom: this._latLng ? 17 : 1,
            center: this._latLng || pos,
        });

        /***********************/
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('pac-card'));
        let autocomplete = new google.maps.places.Autocomplete(<HTMLInputElement>document.getElementById('pac-input'));

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', this.map);

        autocomplete.addListener('place_changed', () => {
            
            this.marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
              // User entered the name of a Place that was not suggested and
              // pressed the Enter key, or the Place Details request failed.
              window.alert("No details available for input: '" + place.name + "'");
              return;
            }
  
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
              this.map.fitBounds(place.geometry.viewport);
            } else {
              this.map.setCenter(place.geometry.location);
              this.map.setZoom(17);  // Why 17? Because it looks good.
            }
            
            this.placeMarker(place.geometry.location);
            
            this.marker.setPosition(place.geometry.location);
            this._latLng = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
            this.onSelect.emit(place.geometry.location);

            this.marker.setVisible(true);
  
            var address = '';
            if (place.address_components) {
              address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');
            }
            //ofc_adr_string
            let adr =  <HTMLInputElement>document.getElementById("pac-input");
            let new_adr =  <HTMLInputElement>document.getElementById("ofc_adr_string");
            new_adr.value = adr.value;
          });
        /**********************/

        this.map.addListener('click', (e)=>{
            this.placeMarker(e.latLng);
            this.onSelect.emit(e.latLng);
            var latlng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            var geocoder = new google.maps.Geocoder;

            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    let adr =  <HTMLInputElement>document.getElementById("pac-input");
                    let new_adr =  <HTMLInputElement>document.getElementById("ofc_adr_string");
                    adr.value = results[0].formatted_address;
                    new_adr.value = results[0].formatted_address;
                }
            });
        });
        if(this.islatLngSet()) this.placeMarker(this._latLng);
    }
    placeMarker(latLng){
        if(this.marker){
            this.marker.setMap(null);
        }
        this.marker = new google.maps.Marker({
            position: latLng,
            map: this.map
        });
    }
    islatLngSet(){
        if(this._latLng && Object.keys(this._latLng).length > 0) this.placeMarker(this._latLng);
    }
}
