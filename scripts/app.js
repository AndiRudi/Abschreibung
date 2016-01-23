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
            for (var item in result) {
              
                var id = result[item].ref;
              
                var searchitem = store[id].Text +  " " + store[id].LfdNr + "<br/>";
                resultdiv.append(searchitem);
            }
            resultdiv.show();
        }
    });

});