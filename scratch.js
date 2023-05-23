/* // promiseStartLocation
const promiseStartLocation = async () => {
  const response = await getAddressCoordinates(mdfront.startlocation);
};

// promiseEndLocation
const promiseEndLocation = getAddressCoordinates(mdfront.endlocation)
  .then((result) => {
    //console.log(result)
    Object.assign(mdfront.endlocation, result);
    //console.log(mdfront.endlocation);
    //resolve(mdfront.ednlocation);
  })
  .catch((err) => {
    // got error
    console.log("Error in promiseEndLocation");
    //console.log(httpsClient);
  });

Promise.all([promiseStartLocation, promiseEndLocation]).then((result) => {
  // Now that we have the enhanced information for the address, let's build some
  // maps for the start, end, and route.
  //console.log("line257")
  console.log(mdfront);
  //Promise.all([promiseStartPointMap, promiseEndPointMap]);
});

// promiseStartPointMap
const promiseStartPointMap = getPointMap(
  mdfront.startlocation.lat,
  mdfront.startlocation.long
)
  .then((result) => {
    //Object.assign(mdfront.endlocation, result);
    //console.log(mdfront.endlocation);
  })
  .catch((err) => {
    // got error
    console.log("error in promiseStartPointMap");
    //console.log(httpsClientß);
  });

// promiseEndPointMap
const promiseEndPointMap = getPointMap(
  mdfront.endlocation.lat,
  mdfront.endlocation.long
)
  .then((result) => {
    //Object.assign(mdfront.endlocation, result);
    //console.log(mdfront.endlocation);
  })
  .catch((err) => {
    // got error
    console.log("error in promiseEndPointMap");
    //console.log(httpsClientß);
  });

Promise.all([promiseStartPointMap, promiseEndPointMap]).then((result) => {
  //console.log("line263");
  //console.log(mdfront);
});

//console.log(start);
//console.log(end);
//console.log(process.env.BINGAPIKEY);

/* axios({
  method: "post",
  url: bingroute,
  params: {
    "waypoint.1": mdfront.startlocation,
    "waypoint.2": mdfront.endlocation,
    key: process.env.BINGAPIKEY,
    //mapMetadata: '1'
  },
  responseType: "stream",
})
  .then(function (response) {
    response.data.pipe(fs.createWriteStream(path.join(mdpath, "map.jpg")));
    //console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  }); */
  */




// Get the point address coordinates and add return that data
async function getAddressCoordinates(address) {
    // given an array of address information call the location API and get the
    // lat and long coordinates along with any additional enrichment infomrmation
    // for the addres field.
  
    var result;
  
    // All of these must be true to do a structured lookup
    const requiredElements = [
      address.addressLine,
      address.locality,
      address.adminDistrict,
      address.postalCode,
    ];
  
    // Are we forcing a new lookup? If so remove any data in address.lat and address.long
    if (argv.force) {
      address.lat = null;
      address.long = null;
    }
    // Stick the key into the address object so it can be used in params
    address.key = process.env.BINGAPIKEY;
  
    // Create an Axios instance for later use with the bingbase
    const ax = axios.create({
      baseURL: bingbase,
      timeout: 1000,
    });
  
    if (address.lat && address.long) {
      // is there already a lat and long in the data - if so we don't need to do anything
      // unless -force is used.
      //
      console.log("this one has lat and long data");
      //
    } else if (requiredElements.every((e) => true)) {
      // is there data in the breakout fields, if so we can do a high precision query
      console.log("Structured Address Found");
      ax
        .get(bingloc, { params: address })
        .then(function (response) {
          // handle success
  
          // Get the main result
          var resources = response.data.resourceSets[0].resources[0];
  
          // Flatten the result to match the frontmatter
          result = resources.address;
          result.lat = resources.point.coordinates[0];
          result.long = resources.point.coordinates[1];
          result.confidence = resources.confidence;
  
          //console.log(result);
  
          // Remove the API key
          address.key = "";
  
          console.log(response);
          resolve(response);
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            //console.log(error.response.data);
            console.log(error.response.status);
            //console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            //console.log("Error", error.message);
          }
          //console.log(error.config);
        });
  
      // Return the enhanced data
      //console.log(result)
      //return result;
    } else {
      console.log("third case");
    }
  }
  
  // Create maps given a point lat and long
  async function getPointMap(lat, long) {
    var result;
  
    // Stick the key into the address object so it can be used in params
    //address.key = process.env.BINGAPIKEY;
  
    // Create an Axios instance for later use with the bingbase
    const ax = axios.create({
      baseURL: bingbase,
      timeout: 1000,
    });
  
    pointURL = bingpoint + "/" + lat + "," + long + "/18";
  
    await ax
      .get(pointURL, {
        params: {
          mapSize: "600,600",
          pushpin: lat + "," + long,
          format: "jpeg",
          key: process.env.BINGAPIKEY,
        },
        responseType: "stream",
      })
      .then(function (response) {
        response.data.pipe(fs.createWriteStream(path.join(mdpath, "point.jpg")));
        //console.log(response);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          //console.log(error.response.data);
          //console.log(error.response.status);
          //console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          //console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          //console.log("Error", error.message);
        }
        //console.log(error.config);
      });
  }
  