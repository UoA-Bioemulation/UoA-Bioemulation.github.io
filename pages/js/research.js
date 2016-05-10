var current_page = undefined;

var project = query_params["project"];

if(project === undefined)
    project = "ooc";

changeTab(project);

$("#research_tabs").find("a").click(function() {
    window.history.pushState({}, document.title, $(this).attr("href"));
    load_query_params();
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
        html += '               Sort By: <a href="#!research?project=' + page + '&sort=year" class="sort_change">Year</a>';
        html += '               | <a href="#!research?project=' + page + '&sort=type" class="sort_change">Type</a>';
        html += '           </span>';
        html += '       </h3>';
        html += '       <div id="publications_holder" class="padding-left-sm">';
        html += loading_html;
        html += '       </div>';
        html += '   </div>';

        if(page === current_page) {
            $("#research_holder").html(html);

            $(".sort_change").click(function() {
                window.history.pushState({}, document.title, $(this).attr("href"));
                load_query_params();
                loadPublications(page);

                return false;
            });

            loadPublications(page);
        }

    })
    .fail(function() {
        if(page === current_page)
            $("#research_holder").html('<div class="alert alert-danger text-center" style="margin-top: 100px; margin-bottom: 100px;">Unable to find content for the requested project</div>');
    });
}

function loadPublications(page) {
    $("#publications_holder").html(loading_html);

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
            html += "<h4>" + keys[i] + "</h4>";
            html += "<ul>";
            for(var j=0; j<sorted[keys[i]].length; j++) {
                html += "<li>" + getStringForPublication(sorted[keys[i]][j]) + "</li>";
            }
            html += "</ul>";
        }

        if(keys.length == 0) {
            html += '<div class="alert alert-info text-center">No publications found.</div>';
        }

        if(page === current_page)
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
        if(page === current_page)
            $("#publications_holder").html('<div class="alert alert-danger text-center">An error occured while fetching publications!</div>');
    });
}
