const moment = require("moment");

// let date = new Date();
// let months = ["Jan", "Feb", "Mar", "Apr"];

// console.log(date.getMonth());

//Jan 1st 1970 00:00:10 am

let date = moment(1234);
// date.add(100, "year").subtract(9, "months") ;
console.log(date.format("MMM Do, YYYY"));
console.log(date.format("hh:mm a"));
