var Turbolinks = require("turbolinks")
Turbolinks.start()

//import axios
import axios from 'axios';
window.axios = axios;

//import stimulus controllers
require('./stimulus.js');

//import jquery
import $ from 'jquery';
import jQuery from 'jquery';
window.$ = jQuery;

//import sweer alerts
import swal from 'sweetalert2';
window.swal = swal;

//import toast plugin
import toast from "toast-master/js/jquery.toast.js";
window.toast = toast;

//import bootstrap javascript
require('bootstrap/dist/js/bootstrap.bundle.min.js');

//import custom script
require('./public-custom.js');

//import ajax script
require('./ajax.js');

//import toast
require('./toastr.js');

//toast css
require('toast-master/css/jquery.toast.css')

//bootsrap css
require('bootstrap/scss/bootstrap.scss');

