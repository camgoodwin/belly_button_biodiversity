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
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
    d3.json("samples.json").then((data) => {
      console.log(data)
      // 3. Create a variable that holds the samples array. 
      var samplesArrary = data.samples;
      console.log(samplesArrary)
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var numberSample = samplesArrary.filter(sampleObj => sampleObj.id == sample); 
      // 5. Create a variable that holds the first sample in the samples array.
      var starterSample = numberSample[0];
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = starterSample.otu_ids;
      console.log(otu_ids)
      var otu_labels = starterSample.otu_labels;
      console.log(otu_labels);
      var sample_values = starterSample.sample_values.map((value) => parseInt(value));
      console.log(sample_values)
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var reverseIDs = otu_ids.map(topOtuIds => topOtuIds).sort(); 
      var topOtuIds = otu_ids.slice(0,10); 
  
      var yticks = reverseIDs
      console.log(yticks)
   
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_values, 
      y: otu_ids.slice(0,10),
      hovertext: otu_labels,
      type: "bar",
      orientation: "h",
      options: {
        scales: {
          xAxes: [{
            barThickness: 6,
            maxBarThickness: 8
          }]
        }
      }
  };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xasis: {title: 'Sample Values'},
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);


    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      mode: otu_labels,
      type: "bubble",
      mode: 'markers',
      marker:{
        color: otu_ids,
        colorscale: "Electric",
        size: sample_values,
        hovertext: otu_labels
      }
    };
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
     
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

    // 4. Create a variable that holds the metadata array.
    var metadata = data.metadata;
    // 5. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // 6. Create a variable that holds the first sample in the metadata array.
    var FirstSample = metaArray[0];
    // 7. Create a variable that holds the washing frequency.
    var washingFreq = parseFloat(FirstSample.washingFreq);
    // 8 .Create the trace for the gauge chart.
    var gaugeData = {
      domain: otu_labels,
      value: 2,
      title: {"Belly Button Washing Frequency" :{
          subtitle: "Scrubs per Week"}
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
      axis: { range: [0, 10]},
      bar: {color: "black"},
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "yellowgreen"},
        { range: [8, 10], color: "green" }
      ],
    
    }
      
  };   
    // 9. Create the layout for the gauge chart.
    var gaugeLayout = { 
      wide: 400, 
      height: 500,
      margin: {t: 0, b: 0 },
      paper_bgcolor: "white",
      font: {color: "black", family: "arial"}
    };
    // 10. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}


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
