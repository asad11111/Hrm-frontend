import {Component, ViewContainerRef} from '@angular/core';
import './app.css'
import {ToastsManager} from "ng2-toastr";
import {HttpClient} from "./shared/services/Http";

@Component({
  selector   : 'app',
  templateUrl: './app.html',
})
export class AppComponent {

  constructor(public toastr: ToastsManager, vRef: ViewContainerRef, public http:HttpClient) {
    this.toastr.setRootViewContainerRef(vRef);
  }
  ngOnInit(){

  }
}
