import 'ie-shim';
import 'core-js';
import 'zone.js/dist/zone';
import './styles.css';


import './google-charts/loader.js'
import 'jquery';
import './inspinia/datetimepicker/bootstrap-datetimepicker.js';
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js';
import 'bootstrap-timepicker/js/bootstrap-timepicker.min.js';
import 'fullcalendar/dist/fullcalendar.min.js'
import './inspinia/js/plugins/metisMenu/jquery.metisMenu.js'
import './inspinia/js/plugins/slimscroll/jquery.slimscroll.min.js'
import 'select2/dist/js/select2.full.min.js';


import './inspinia/js/inspinia.js'

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {AppModule} from './app/app.module';

// enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
