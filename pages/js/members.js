$.ajax("/pages/members.json")
.done(function(data) {
    if(typeof data === "string") {
        members = JSON.parse(data);
    }
    else {
        members = data;
    }

    var member = query_params["member"];

    if(typeof member !== "undefined" && member !== "") {
        var member_struct = null;

        for(var i=0; i<members.length; i++) {
            if('key' in members[i]) {
                if(member === members[i]['key']) {
                    member_struct = members[i];
                    break;
                }
            }
        }

        if(member_struct === null) {
            $("#members_holder").html('<div class="alert alert-danger text-center" style="margin-top: 100px; margin-bottom: 100px;">Member ' + member + ' not found!<br /><br /><a href="#!members">Return to member list</a>.</div>');
            return;
        }

        var html = '<div class="row">';
        html += '   <div class="col-sm-3 col-sm-push-9 text-center">';

        if('photo' in member_struct) {
            html += '       <img src="' + member_struct["photo"] + '" style="max-width: 200px; max-height: 400px;" />';
        }

        html += '   </div>';
        html += '   <div class="col-sm-9 col-sm-pull-3">';
        html += '       <h2>';
        html += '           ' + member_struct["name"];

        if('position' in member_struct) {
            html += '           <br /><span class="small">' + member_struct["position"] + '</span>';
        }

        html += '       </h2>';

        if('contact' in member_struct) {
            html += '       <h3>Contact Details</h3>';
            for(var method in member_struct["contact"]) {
                method_name = make_nice_header(method);

                var content = member_struct["contact"][method];
                if(method === "email") {
                    content = '<a href="mailto:' + member_struct["contact"][method] + '">' + member_struct["contact"][method] + '</a>';
                }

                html += '       </i> <span class="font-bold">' + method_name + '</span>: ' + content + '<br />';
            }
        }

        if('info' in member_struct) {
            for(var info in member_struct["info"]) {
                info_name = make_nice_header(info);

                html += '       <h3>' + info_name + '</h3>';
                html += '       ' + member_struct["info"][info];
            }
        }

        html += '       <h3>';
        html += '           Publications';
        html += '           <span class="small" style="font-size: 60%;">';
        html += '               Sort By: <a href="#!members?member=' + member + '&sort=year">Year</a>';
        html += '               | <a href="#!members?member=' + member + '&sort=type">Type</a>';
        html += '           </span>';
        html += '       </h3>';
        html += '       <div id="publications_holder" class="padding-left-sm">';
        html += '       </div>';
        html += '   </div>';
        html += '</div>';

        $parsed = $($.parseHTML(html));

        $.ajax("/pages/publications.json")
        .done(function(datapub) {
            if(typeof data === "string") {
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

                if('our_authors' in publications[i]) {
                    if($.inArray(member, publications[i]['our_authors']) > -1) {
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

            $parsed.find("#publications_holder").html(htmlpub);

            $("#members_holder").html($parsed);

            $('#bibtexModal').on('show.bs.modal', function (event) {
                var $button = $(event.relatedTarget);
                var bibtex_key = $button.data('entry');
                var bibtex = $("#" + bibtex_key).html();
                var $modal = $(this);
                $modal.find('.modal-body').html("<pre>" + bibtex + "</pre>");
            });
        })
        .fail(function() {
            $parsed.find("#publications_holder").html('<div class="alert alert-danger text-center">An error occured while fetching publications for this member...</div>');
            $("#members_holder").html($parsed);
        });
    }
    else {
        var html = '<ul>';

        for(var i=0; i<members.length; i++) {
            html += '<li><a href="#!members?member=' + members[i]["key"] + '">' + members[i]["name"] + "</a></li>";
        }

        html += '</ul>';

        $("#members_holder").html(html);
    }
})
.fail(function() {
    $("#members_holder").html('<div class="alert alert-danger text-center" style="margin-top: 100px; margin-bottom: 100px;">An error occured while fetching members...</div>');
});
