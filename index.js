// $(document).ready(function(){
    // $('#MyTable').DataTable();
    
//initially there is no filter, present all of the data
var filteredData = dataSet;

var $loadMoreBtn = document.querySelector("#load-btn");

// Set a startingIndex and resultsPerPage variable
var startingIndex = 0;
var resultsPerPage = 10;

var table = document.createElement("table")
var tablePlaceHolder = document.querySelector("#tablePlaceHolder")
table.className="table table-striped";
// table.className = "dataTable";
// table.setAttribute("id","MyTable");
tablePlaceHolder.appendChild(table)

// create the table header
var theadlist = Object.keys(filteredData[0])
var thead = table.createTHead();
theadrow = thead.insertRow();
for (var k = 0; k < theadlist.length; k++){
    if (theadlist[k] != 'durationMinutes'){
        var th = document.createElement("th")
        th.innerHTML = theadlist[k]
    }
    theadrow.appendChild(th)    
}

//add a row of filter inputs
{/* <div class="form-group">
          <input type="text" class="form-control" id="date" placeholder="m/d/yyyy">
          <!-- <input data-provide="datepicker"> -->
          <a id="search" class="btn btn-default">Search</a>
        </div> */}
theadrow = thead.insertRow();
for (var k = 0; k < theadlist.length; k++){
    if (theadlist[k] != 'durationMinutes'){
        var th = document.createElement("th")
        th.innerHTML = "<input type='text' class='form-control' id='" + theadlist[k] + "'>"
    }
    // if (theadlist[k] == 'comments'){
    //     th.innerHTML =  "<input type='text' class='form-control' id='" + theadlist[k] + "'>"
    // }
    theadrow.appendChild(th)    
}

var tbody = table.createTBody();

btn = document.querySelector("#filter")

btn.addEventListener("click", filterSitings)


function render_table(){

  // Set the value of endingIndex to startingIndex + resultsPerPage
  var endingIndex = startingIndex + resultsPerPage;
  // Get a section of the addressData array to render
  var sitingsSubset = filteredData.slice(startingIndex, endingIndex);

    if (filteredData.length == 0) {
        var Results = document.querySelector("#Results")
        Results.innerHTML = "<h1>No sitings match that search criteria</h1>"
        filteredData=dataSet;

    }
    else{
        var Results = document.querySelector("#Results")
        if (filteredData == dataSet){
            Results.innerHTML = "<h3>" + filteredData.length + " total sitings logged</h3>"

        }
        else {
            Results.innerHTML = "<h3>" + filteredData.length + " results match that search criteria</h3>"    
        }

        tbody.innerHTML='';
        // for (var c = 0; c< filteredData.length; c++){
        var sitingsSubset = filteredData.slice(startingIndex, endingIndex);

        for (var c = 0; c< sitingsSubset.length; c++){
        // for (var c = 0; c< 5; c++){
            row = tbody.insertRow(c);
            cells = Object.keys(sitingsSubset[c])
            // cells = Object.keys(filteredData[c])
            thisSiting = sitingsSubset[c]
            // thisSiting = filteredData[c]
            for (var d=0; d< cells.length; d++){
                if (cells[d] != 'durationMinutes') {
                    cell = row.insertCell()
                    thisCell = cells[d]
                    cell.innerHTML= thisSiting[thisCell]
                }

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
            var sitingComments = sitings.comments.toString();
        }
        else{
            var sitingComments = '';
        }

        console.log("formattedSitingDate: " + formattedSitingDate);
        console.log("formattedInputDate" + formattedInputDate);
        if (formattedSitingDate === formattedInputDate 
            && sitingCity === inputCity 
            && sitingState === inputState
            && sitingCountry === inputCountry 
            && sitingShape === inputShape
            // && sitingDuration === inputDuration
            // && sitingComments === inputComments
            && sitingComments.includes(inputComments)
        ) {
          return true;
        }
        return false;

        // If true, add the address to the filteredData, otherwise don't add it to filteredData
        // return formattedSitingDate.getTime()  === formattedInputDate.getTime()  &&  sitingState  === 'ca';
      });

    render_table();


}

// Add an event listener to the button, call handleButtonClick when clicked
$loadMoreBtn.addEventListener("click", handleButtonClick);

function handleButtonClick() {
  // Increase startingIndex by resultsPerPage and render the next section of the table
  startingIndex += resultsPerPage;
  render_table();
  // Check to see if there are any more results to render
  if (startingIndex + resultsPerPage >= filteredData.length) {
    $loadMoreBtn.classList.add("disabled");
    $loadMoreBtn.innerText = "No more sitings to load";
    $loadMoreBtn.removeEventListener("click", handleButtonClick);
  }
}

render_table();
// });