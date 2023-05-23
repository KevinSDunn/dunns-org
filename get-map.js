/* 
get-map.js

Call with the path to the index.md file. Application will read the
index.md file and create the maps and update the YAML file with the
lat, long, and additional address information if needed.

Process

Get the front matter. Determine if there is a lat long in the front
matter - if so use that to draw the maps. Otherwide look in the 
startlocation and endlocation fields for address information and attempt
to get the lat long that way

Get a map image of the start location and store as start.jpg
Get a map image of the end location and store as end.jpg
Get a map image of the route and store as route.jpg

Update the YAML file with any updated information.
*/

var fs = require("fs"),
  fm = require("front-matter"),
  path = require("path"),
  axios = require("axios"),
  { config } = require("dotenv");

// Get the parameters - die if not provided
var argv = require("minimist-lite")(process.argv.slice(2));
console.log(argv._[0]);

if (argv._[0]) {
  var mdpath = argv._[0];
} else {
  console.log("You must supply the content/triplog folder to work with");
  process.exit(1);
}

// Get environment variables
config();

// Microsoft Service Endpoints
var bingbase = "";
if (argv.dev) {
  bingbase = "https://dev.virtualearth.net/REST/v1/";
} else {
  bingbase = "https://?.virtualearth.net/REST/v1/";
}

// Set up the different URI REST segments
const bingroute = "Imagery/Map/Road/Routes";
const bingpoint = "Imagery/Map/Aerial";
const bingloc = "Locations";

/* ----------
Functions
---------- */
// Get the frontmatter from the file into a object
function getFrontmatter(file) {
  var data = fs.readFileSync(file, "utf8");
  var frontmatter = fm(data);
  var content = JSON.parse(JSON.stringify(frontmatter.attributes));
  // console.log(content);
  return content;
}

/* ----------
Main
---------- */

// Get the frontmatter
var mdfront = getFrontmatter(path.join(mdpath, "index.md"));
console.log(mdfront)

// Get the start location
axios.get('https://dev.virtualearth.net/REST/v1/Locations/US/TX/75137/Duncanville/1622%20South%20Greenstone%20Lane?&key=AlOMdV7dQVk5trzFN76dEz0go7H6SijAHz2WYFul0IbCiYdPOmmsYZ8Y0TKXVf0I')
  .then(response => {
    console.log('Response Data')
    console.log(response.data)
  })
  .catch(err => {
    console.log('error')
  });

  // Get the end location
axios.get('https://dev.virtualearth.net/REST/v1/Locations/US/TX/75137/Duncanville/1622%20South%20Greenstone%20Lane?&key=AlOMdV7dQVk5trzFN76dEz0go7H6SijAHz2WYFul0IbCiYdPOmmsYZ8Y0TKXVf0I')
.then(response => {
  console.log('Response Data')
  console.log(response.data)
})
.catch(err => {
  console.log('error')
});