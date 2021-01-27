 function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
 });
}

// Initialize the dashboard
 init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var samplesArrary = data.samples;
    console.log(samplesArrary)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var numberSample = samplesArrary.filter(sampleObj => sampleObj.id == sample);
    console.log(numberSample)
    //  5. Create a variable that holds the first sample in the array.
    var starterSample = samplesArrary[0];
  

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = numberSample.map(x => x.otu_ids);
    console.log(otu_ids)
    var otu_labels = numberSample.map(x => x.otu_labels);
    var sample_values = numberSample.map(x => x.sample_values);
    console.log(sample_values)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var reverseIDs = otu_ids.map(topOtuIds => topOtuIds).reverse(); 
    var topOtuIds = otu_ids.slice(0,10); 

    var yticks = reverseIDs
    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values,
      y: yticks,
      type: 'bar'
            
    }];
    console.table(barData)
    //var first_chart = [barData];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Belly Button Biodiversity Dashboard",
      xaxis: {title: 'Sample Values'}
    }
    // 10. Use Plotly to plot the data with the layout. 
    // Plotly.newPlot("bar", first_chart, barLayout);
    //let bar = document.getElementByID("bar");
    Plotly.newPlot('bar', barData, barLayout);
  });

    //  // Use Plotly to plot the data with the layout. 
// 1. Create the buildCharts function.
// function buildCharts(sample) {
//   // 2. Use d3.json to load and retrieve the samples.json file 
//   d3.json("samples.json").then((data) => {
//     console.log(data);


    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      type: "bubble",
      mode: 'markers',
      marker:{
        color: sample_values,
        colorscale: sample_values,
        size: sample_values
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria",
      showlegend: false,
      xAxisID: "OTU ID"
      
    };

    // 3. Use Plotly to plot the data with the layout.
    //let bubble = document.getElementByID('bubble');
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
 //1. Create a variable that filters the metadata array for the object with the desired sample number.    
      var metadata = data.metadata     
      var metaArray = metadata.filter(sampleObj => sampleObj.id == metadata);
//     // Create a variable that holds the first sample in the array.
//     // 2. Create a variable that holds the first sample in the metadata array.
      var firstSample = metaArray[0];

//     // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = data.samples.map(x => x.otu_ids);
      var otu_labels = data.samples.map(x => x.otu_labels);
      var sample_values = data.samples.map(x => x.sample_values);

//     // 3. Create a variable that holds the washing frequency.
      var washingFreq = parseFloat(metadata.washingFreq)
  

// 1. Create the buildCharts function.
// function buildCharts(sample) {
//   // 2. Use d3.json to load and retrieve the samples.json file 
//   d3.json("samples.json").then((data) => {
//     console.log(data);

 // D2: 3. Use Plotly to plot the data with the layout.
   
    // 4. Create the trace for the gauge chart.
    var gaugeData = {
      domain: otu_labels,
      value: 250,
      title: "Scrubs per Week",
      type: "indicator",
      
     
  };
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     wide: 400, 
      height: 120,
      margin: {t: 20, r: 20, b: 20 },
      paper_bgcolor: "grey",
      font: {color: "black", family: "arial"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    
}