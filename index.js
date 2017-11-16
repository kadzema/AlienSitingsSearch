//initially there is no filter, display all of the data
var filteredData = dataSet;

var $loadPrevBtn = document.querySelector("#load-prev");
var $loadNextBtn = document.querySelector("#load-next");

btn = document.querySelector("#filter")
btn.addEventListener("click", filterSitings)

//allow for clearing of all filters
resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click",function(){

    document.querySelector("#datetime").value = '';
    document.querySelector("#city").value = '';
    document.querySelector("#state").value = '';
    document.querySelector("#country").value = '';
    document.querySelector("#shape").value = '';
    document.querySelector("#comments").value = '';
    filteredData = dataSet;
    render_table();
})

// Set a startingIndex and resultsPerPage variable
var startingIndex = 0;

var showNum = document.querySelector("#showNum"); 
var resultsPerPage = showNum.value;

showNum.addEventListener("change",function(){
    render_table();
})


var table = document.createElement("table")
var tablePlaceHolder = document.querySelector("#tablePlaceHolder")
table.className="table table-striped";
table.setAttribute("data-toggle","table");
tablePlaceHolder.appendChild(table)

// create the table header
var theadlist = Object.keys(filteredData[0])
var thead = table.createTHead();
theadrow = thead.insertRow();
for (var k = 0; k < theadlist.length; k++){
    if (theadlist[k] != 'durationMinutes'){
        var th = document.createElement("th");
        th.setAttribute("data-field",theadlist[k])
        th.setAttribute("data-sortable",'true');
        th.innerHTML = theadlist[k];
    }
    theadrow.appendChild(th)    
}

//add a row of filter inputs
theadrow = thead.insertRow();
for (var k = 0; k < theadlist.length; k++){
    if (theadlist[k] != 'durationMinutes'){
        var th = document.createElement("th")
        th.innerHTML = "<input type='text' class='form-control' id='" + theadlist[k] + "'>"
    }
    theadrow.appendChild(th)    
}

var tbody = table.createTBody();

function checkPagination(resultsPerPage){
    console.log("checkPagination");
    console.log("starting: " + startingIndex);
    console.log("resultsPerpge:" + resultsPerPage);

    if (startingIndex + resultsPerPage >= filteredData.length) {
        $loadNextBtn.classList.add("disabled");
        $loadNextBtn.removeEventListener("click", loadNext);
      }
      // allow previous results when previous available
      if (startingIndex - resultsPerPage >= 0){
          $loadPrevBtn.classList.remove("disabled");
          $loadPrevBtn.addEventListener("click",loadPrevious);
      }
      if (startingIndex - resultsPerPage < 0){
        $loadPrevBtn.classList.add("disabled");
        $loadPrevBtn.removeEventListener("click", loadPrevious);
      }
      
      // allow next results when next available
      if (startingIndex + resultsPerPage <= filteredData.length) {
          $loadNextBtn.classList.remove("disabled");
          $loadNextBtn.addEventListener("click",loadNext);
      }
}

function render_table(){

  // Set the value of endingIndex to startingIndex + resultsPerPage
  var resultsPerPage = document.querySelector("#showNum").value; 
  console.log(resultsPerPage)
  var endingIndex = startingIndex + resultsPerPage;

  console.log("rendertbale");
  console.log("starting: " + startingIndex);
  console.log("resultsPerpge:" + resultsPerPage);


  checkPagination(resultsPerPage);

  // Get a section of the addressData array to render
  var sitingsSubset = filteredData.slice(startingIndex, endingIndex);

    if (filteredData.length == 0) {
        var Results = document.querySelector("#Results")
        Results.innerHTML = "<h3>No sitings match that search criteria </h3>" //- showing all " + dataSet.length + " results</h3>"
        filteredData='';

    }
    else{
        var Results = document.querySelector("#Results")
        if (filteredData == dataSet){
            Results.innerHTML = "<h3>" + filteredData.length + " Total Sitings</h3>"

        }
        else {
            Results.innerHTML = "<h3>" + filteredData.length + " results match that search criteria</h3>"    
        }
    }

        tbody.innerHTML='';
        var sitingsSubset = filteredData.slice(startingIndex, endingIndex);

        for (var c = 0; c< sitingsSubset.length; c++){
            row = tbody.insertRow(c);
            cells = Object.keys(sitingsSubset[c])
            thisSiting = sitingsSubset[c]
            for (var d=0; d< cells.length; d++){
                if (cells[d] != 'durationMinutes') {
                    cell = row.insertCell()
                    thisCell = cells[d]
                    cell.innerHTML= thisSiting[thisCell]
                }

            }
        }
}

function filterSitings(){

    // reset startingIndex
    var startingIndex = 0;
    
    var inputDate = document.querySelector("#datetime").value.trim();
    if (inputDate.length > 0){
        var formattedInputDate = new Date(inputDate).getTime();
    }
    else {
        var formattedInputDate = '';
    }

    var inputCity = document.querySelector("#city").value.trim().toLowerCase();
    var inputState = document.querySelector("#state").value.trim().toLowerCase();
    var inputCountry = document.querySelector("#country").value.trim().toLowerCase();
    var inputShape = document.querySelector("#shape").value.trim().toLowerCase();
    // var inputDuration = document.querySelector("#durationMinutes").value.trim().toLowerCase();
    var inputComments = document.querySelector("#comments").value.trim().toLowerCase();


    filteredData = dataSet.filter(function(sitings){
        var sitingDate = sitings.datetime.substring(0, inputDate.length).trim();
        if (sitingDate.length > 0) {
            var formattedSitingDate = new Date(sitingDate).getTime();
        }
        else {
            var formattedSitingDate = '';
        }

        var sitingCity = sitings.city.substring(0, inputCity.length).trim().toLowerCase();
        var sitingState = sitings.state.substring(0, inputState.length).trim().toLowerCase();
        var sitingCountry = sitings.country.substring(0, inputCountry.length).trim().toLowerCase();
        var sitingShape = sitings.shape.substring(0, inputShape.length).trim().toLowerCase();
        // var sitingDuration = sitings.durationMinutes.substring(0, inputDuration.length);
        if (inputComments.length > 0){
            var sitingComments = sitings.comments.toString().toLowerCase() + " Duration: " + sitingsDuration;
        }
        else{
            var sitingComments = '';
        }

        if (formattedSitingDate === formattedInputDate 
            && sitingCity === inputCity 
            && sitingState === inputState
            && sitingCountry === inputCountry 
            && sitingShape === inputShape
            && sitingComments.includes(inputComments)
        ) {
          return true;
        }
        return false;

        // If true, add the siting to the filteredData, otherwise don't add it to filteredData
      });

    render_table();


}

$loadNextBtn.addEventListener("click", loadNext);


function loadNext() {
    resultsPerPage = document.querySelector("#showNum").value;
    // Increase startingIndex by resultsPerPage and render the next section of the table
    startingIndex += resultsPerPage;
    render_table();
  }

  function loadPrevious() {
    resultsPerPage = document.querySelector("#showNum").value;
    // Decrease startingIndex by resultsPerPage and render the pervious section of the table
    startingIndex -= resultsPerPage;
    render_table();
  }

render_table();
