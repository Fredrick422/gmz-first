"use strict";

var Turbolinks = require("turbolinks");
Turbolinks.start();

//import axios
import axios from 'axios';
window.axios = axios;

//import stimulus controllers
require('./stimulus.js');

import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = jQuery;


//import sweer alerts
import swal from 'sweetalert2';
window.swal = swal;

import Cookies from 'js-cookie';
window.Cookies = Cookies;

//import toast plugin
import toast from "toast-master/js/jquery.toast.js";
window.toast = toast;

require('bootstrap/dist/js/bootstrap.bundle.min.js');
require('./perfect-scrollbar.jquery.min.js');
require('../../../node_modules/wizard/jquery.steps.min.js')
require('../../../node_modules/wizard/jquery.validate.min.js')
require('../../../node_modules/footable/js/footable.all.min.js')
require('bootstrap-select/bootstrap-select.min.js');

//include custom scripts
require('./perfect-scrollbar.jquery.min.js')
require('./steps.js');
require('./sidebarmenu.js');
require('./custom.min.js');
require('./mask.js');
require('./toastr.js');
require('./footable-init.js')

//import css
require('toast-master/css/jquery.toast.css');
require('bootstrap/scss/bootstrap.scss');
