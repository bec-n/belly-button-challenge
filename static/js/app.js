// Get the url endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
console.log(data);
});

// Display the default plots and populate dropdown menu 
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data 
    d3.json(url).then((data) => {

        // Create variable for sample names 
        let names = data.names;

        // Loop through each name and add name to dropdown 
        names.forEach((name) => {
        dropdownMenu.append("option").text(name).property("value", name);
        });

        let name = names[0];

        // Create functions for charts and panel
        barchart(name);
        bubblechart(name);
        demographics(name);
    });
}

// Create bar chart 
function barchart(value) {

    // Fetch the JSON data 
    d3.json(url).then((data) => {

        // Create a variable for the data  
        let samples = data.samples;

        // Filter data to select value 
        let filterData = samples.filter((sample) => sample.id == value);

        // Get first value from the array 
        let first = filterData[0];
        
        // Trace for the data
        let trace = [{

            // Slice the top 10 items 
            x: first.sample_values.slice(0,10).reverse(),
            y: first.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: first.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"            
        }];

        // Apply layout
        let layout = {
            xaxis: {title: "Top 10 OTUs"}
        };
    
        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", trace, layout);
    });
}


// Create bubble chart 
function bubblechart(value) {

    // Fetch the JSON data 
    d3.json(url).then((data) => {

        // Create a variable for the data  
        let samples = data.samples;
    
        // Filter data to select value 
        let filterData = samples.filter((sample) => sample.id == value);
    
        // Get first value from the array 
        let first = filterData[0];
        
        // Trace for the data
        let trace = [{
            x: first.otu_ids,
            y: first.sample_values,
            text: first.otu_labels,
            mode: "markers",
            marker: {
                size: first.sample_values,
                color: first.otu_ids,
            }
        }];
    
        // Apply layout
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Create demographics panel 
function demographics(value) {

    // Fetch the JSON data 
    d3.json(url).then((data) => {

        // Create a variable for the data  
        let metadata = data.metadata;
        
        // Filter data to select value 
        let filterData = metadata.filter((sample) => sample.id == value);
      
        // Get first value from the array 
        let first = filterData[0]
        
        // Clear metadata 
        d3.select("#sample-metadata").html("");
  
        // Add key value pairs 
        let pairs = Object.entries(first);
        
        // Iterate through array
        pairs.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
  }

// Update plots when option changed with id "optionChanged"
function optionChanged(value) {    
    barchart(value);
    bubblechart(value);
    demographics(value);
}

init();