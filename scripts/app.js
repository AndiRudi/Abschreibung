var searchIndex;
var store = {};

$(document).ready(function () {

    searchIndex = lunr(function () {
        this.field('Text');
        this.field('Nutzungsdauer');
        this.field('Tabelle');
        this.field('LfdNr');
        this.ref('Id');
    });


    //Build index
    //TODO: Save in Session storage
    $.getJSON('searchIndex.json', function (response) {
        console.log("Starting building index");
       
        $.each(response, function (index, element) {
            //console.debug(element);
            searchIndex.add(element);
            store[element.Id] = element;
        });

        console.log("Finished building index");
    })
    .fail(function (jqxhr, textStatus, error) {
        console.log("Error occured on loading search index");
        console.debug(jqxhr);
        console.debug(textStatus);
        console.debug(error);
    });


    // Handle search
    $('#searchForm').on('submit', function (event) {
        event.preventDefault();

        console.log("Searching started");

        // Get query
        var query = $('#searchTxt').val();

        // Search for it
        var result = searchIndex.search(query);

        console.log("Searching done. Found " + result.length);

        // Output it
        var resultdiv = $('#content');

        if (result.length === 0) {
            // Hide results
            resultdiv.hide();

        } else {

            // Show results
            resultdiv.empty();
            
            var html = "<table id='prices'>";
            html += "<tbody>";
            html += "   <tr class='top'>";
            html += "       <th width='55%'>Anlagegut</th>";
            html += "       <th width='15%' class='right'><div align='center'>Nutzungsdauer</div></th>";
            html += "       <th width='15%' class='right'><div align='center'>Tabelle</div></th>";
            html += "       <th width='15%' class='right'><div align='center'>Fundstelle</div></th>";  
            html += "   </tr>";

            for (var item in result) {
              
                var id = result[item].ref;
                html += " <tr>";
                html += "   <td>" + store[id].Text + "</td>";
                html += "   <td class='right'><div align='center'>" + store[id].Nutzungsdauer + "</div></td>";
                html += "   <td class='right'><div align='center'>" + store[id].Tabelle + "</div></td>";
                html += "   <td class='right'><div align='center'>" + store[id].LfdNr + "</div></td>";
                html += "</tr>";
            }            
            html += "   </tbody>";
            html += "</table>";

            resultdiv.append(html);

            resultdiv.show();
        }
    });

});