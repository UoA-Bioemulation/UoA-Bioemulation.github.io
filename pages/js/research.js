var current_page = undefined;

var project = query_params["project"];

if(project === undefined)
    project = "exooc";

changeTab(project);

$("#research_tabs").find("a").click(function() {
    window.history.pushState({}, document.title, "/#!research?project=" + $(this).data("tab"));
    changeTab($(this).data("tab"));

    return false;
})

function changeTab(page) {
    if(page === current_page)
        return;

    current_page = page;

    $("#research_tabs").find("a").parent().removeClass("active");
    $("#research_tabs").find("a[data-tab=" + page + "]").parent().addClass("active");

    $("#research_holder").html(loading_html);

    $.ajax("/pages/research/" + page + ".html")
    .done(function(data) {
        if(page !== current_page)
            return;

        html = '<div>';
        html += data;
        html += '       <h3 class="margin-top-md">';
        html += '           Publications';
        html += '           <span class="small" style="font-size: 60%;">';
        html += '               Sort By: <a href="#!research?project=' + page + '&sort=year">Year</a>';
        html += '               | <a href="#!research?project=' + page + '&sort=type">Type</a>';
        html += '           </span>';
        html += '       </h3>';
        html += '       <div id="publications_holder" class="padding-left-sm">';
        html += '       </div>';
        html += '   </div>';

        $parsed = $($.parseHTML(html));

        $.ajax("/pages/publications.json")
        .done(function(datapub) {
            if(typeof datapub === "string") {
                publications = JSON.parse(datapub);
            }
            else {
                publications = datapub;
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

                if('our_projects' in publications[i]) {
                    if($.inArray(page, publications[i]['our_projects']) > -1) {
                        if(!sorted.hasOwnProperty(key)) {
                            sorted[key] = [];
                            keys.push(key);
                        }

                        sorted[key].push(publications[i]);
                    }
                }
            }

            keys.sort();

            if(sort !== "type") {
                keys.reverse();
            }

            var htmlpub = '<div class="modal fade" id="bibtexModal" tabindex="-1" role="dialog" aria-labelledby="bibtexModalLabel">';
            htmlpub += '   <div class="modal-dialog modal-lg" role="document">';
            htmlpub += '       <div class="modal-content">';
            htmlpub += '           <div class="modal-header">';
            htmlpub += '               <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            htmlpub += '               <h4 class="modal-title" id="exampleModalLabel">Bibtex</h4>';
            htmlpub += '           </div>';
            htmlpub += '           <div class="modal-body">';
            htmlpub += '           </div>';
            htmlpub += '       </div>';
            htmlpub += '   </div>';
            htmlpub += '</div>';

            for(var i=0; i<keys.length; i++) {
                htmlpub += "<h4>" + keys[i] + "</h4>";
                htmlpub += "<ul>";
                for(var j=0; j<sorted[keys[i]].length; j++) {
                    htmlpub += "<li>" + getStringForPublication(sorted[keys[i]][j]) + "</li>";
                }
                htmlpub += "</ul>";
            }

            if(keys.length == 0) {
                htmlpub += '<div class="alert alert-info text-center">No publications found.</div>';
            }
            console.log($parsed);
            $parsed.find("#publications_holder").html(htmlpub);

            if(page === current_page)
                $("#research_holder").html($parsed);

            $('#bibtexModal').on('show.bs.modal', function (event) {
                var $button = $(event.relatedTarget);
                var bibtex_key = $button.data('entry');
                var bibtex = $("#" + bibtex_key).html();
                var $modal = $(this);
                $modal.find('.modal-body').html("<pre>" + bibtex + "</pre>");
            });
        })
        .fail(function() {
            $parsed.find("#publications_holder").html('<div class="alert alert-danger text-center">An error occured while fetching publications!</div>');
            if(page === current_page)
                $("#research_holder").html($parsed);
        });
    })
    .fail(function() {
        if(page === current_page)
            $("#research_holder").html('<div class="alert alert-danger text-center" style="margin-top: 100px; margin-bottom: 100px;">Unable to find content for the requested project</div>');
    });
}
