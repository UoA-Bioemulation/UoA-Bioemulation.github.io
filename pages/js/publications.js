$.ajax("/pages/publications.json")
.done(function(data) {
    if(typeof data === "string") {
        publications = JSON.parse(data);
    }
    else {
        publications = data;
    }

    sorted = [];
    keys = [];

    var sort = query_params["sort"];

    for(var i=0; i<publications.length; i++) {
        key = 'Unknown';

        if(sort === "type") {
            if('type' in publications[i]) {
                key = getPaperTypeForKey(publications[i]["type"]);
            }
        }
        else {
            if('year' in publications[i]) {
                key = publications[i]['year'];
            }
        }


        if(!sorted.hasOwnProperty(key)) {
            sorted[key] = [];
            keys.push(key);
        }

        sorted[key].push(publications[i]);
    }

    keys.sort();

    if(sort !== "type") {
        keys.reverse();
    }

    var html = '<div class="modal fade" id="bibtexModal" tabindex="-1" role="dialog" aria-labelledby="bibtexModalLabel">';
    html += '   <div class="modal-dialog modal-lg" role="document">';
    html += '       <div class="modal-content">';
    html += '           <div class="modal-header">';
    html += '               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    html += '               <h4 class="modal-title" id="exampleModalLabel">Bibtex</h4>';
    html += '           </div>';
    html += '           <div class="modal-body">';
    html += '           </div>';
    html += '       </div>';
    html += '   </div>';
    html += '</div>';

    for(var i=0; i<keys.length; i++) {
        html += "<h3>" + keys[i] + "</h3>";
        html += "<ul>";
        for(var j=0; j<sorted[keys[i]].length; j++) {
            html += "<li>" + getStringForPublication(sorted[keys[i]][j]) + "</li>";
        }
        html += "</ul>";
    }

    $("#publications_holder").html(html);

    $('#bibtexModal').on('show.bs.modal', function (event) {
        var $button = $(event.relatedTarget);
        var bibtex_key = $button.data('entry');
        var bibtex = $("#" + bibtex_key).html();
        var $modal = $(this);
        $modal.find('.modal-body').html("<pre>" + bibtex + "</pre>");
    });
})
.fail(function() {
    $("#publications_holder").html('<div class="alert alert-danger text-center" style="margin-top: 100px; margin-bottom: 100px;">An error occured while fetching publications...</div>');
});
