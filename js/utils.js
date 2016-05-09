var loading_html = '<div style="padding-top: 100px; padding-bottom: 100px;"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div>';

function make_nice_header(string) {
    string = string.replace('_', ' ');
    string = string.toLowerCase();

    return string.replace(/(^| )(\w)/g, function(x) {
        return x.toUpperCase();
    });
}

function getRoleNameForKey(key) {
    switch(key) {
        case "leader": return "Group Leader";
        default: return make_nice_header(key);
    }
}

function getMonthForShort(mon) {
    switch(mon) {
        case "jan": return "January";
        case "feb": return "February";
        case "mar": return "March";
        case "apr": return "April";
        case "may": return "May";
        case "jun": return "June";
        case "jul": return "July";
        case "aug": return "August";
        case "sep": return "September";
        case "oct": return "October";
        case "nov": return "November";
        case "dec": return "December";
        default: return mon;
    }
}

function getPaperTypeForKey(key) {
    switch(key) {
        case "article": return "Journal Article";
        case "proceedings": return "Conference";
        case "techreport": return "Technical Report";
        default: return make_nice_header(key);
    }
}

function getReferenceForProceeding(publication) {
    var str = "";

    if("author" in publication && publication["author"] !== "") {
        str += publication["author"] + ". ";
    }

    if("title" in publication && publication["title"] !== "") {
        str += publication["title"] + ". ";
    }

    if("booktitle" in publication && publication["booktitle"] !== "") {
        str += publication["booktitle"] + ", ";
    }

    if("location" in publication && publication["location"] !== "") {
        str += publication["location"] + ", ";
    }

    if("month" in publication && publication["month"] !== "") {
        str += getMonthForShort(publication["month"]) + ", ";
    }

    if("year" in publication && publication["year"] !== "") {
        str += publication["year"] + ", ";
    }

    if(str.substr(str.length-2) === ", ") {
        str = str.substr(0, str.length-2) + ". ";
    }

    if("note" in publication && publication["note"] !== "") {
        str += '<span class="label label-success">' + publication["note"] + '</span> ';
    }

    return str;
}

function getReferenceForArticle(publication) {
    var str = "";

    if("author" in publication && publication["author"] !== "") {
        str += publication["author"] + ". ";
    }

    if("title" in publication && publication["title"] !== "") {
        str += publication["title"] + ". ";
    }

    if("journal" in publication && publication["journal"] !== "") {
        str += "In <em>" + publication["journal"] + "</em>, ";
    }

    if("volume" in publication && publication["volume"] !== "") {
        str += "vol. " + publication["volume"] + ", ";
    }

    if("number" in publication && publication["number"] !== "") {
        str += "no. " + publication["number"] + ", ";
    }

    if("pages" in publication && publication["pages"] !== "") {
        str += "pp. " + publication["pages"] + ", ";
    }

    if("month" in publication && publication["month"] !== "") {
        str += getMonthForShort(publication["month"]) + ", ";
    }

    if("year" in publication && publication["year"] !== "") {
        str += publication["year"] + ", ";
    }

    if(str.substr(str.length-2) === ", ") {
        str = str.substr(0, str.length-2) + ". ";
    }

    if("note" in publication && publication["note"] !== "") {
        str += '<span class="label label-success">' + publication["note"] + '</span> ';
    }

    return str;
}

function getReferenceForTechReport(publication) {
    var str = "";

    if("author" in publication && publication["author"] !== "") {
        str += publication["author"] + ". ";
    }

    if("title" in publication && publication["title"] !== "") {
        str += publication["title"] + ", ";
    }

    if("number" in publication && publication["number"] !== "") {
        str += "Technical Report " + publication["number"] + ", ";
    }

    if("institution" in publication && publication["institution"] !== "") {
        str += publication["institution"] + ", ";
    }

    if("month" in publication && publication["month"] !== "") {
        str += getMonthForShort(publication["month"]) + ", ";
    }

    if("year" in publication && publication["year"] !== "") {
        str += publication["year"] + ", ";
    }

    if(str.substr(str.length-2) === ", ") {
        str = str.substr(0, str.length-2) + ". ";
    }

    if("note" in publication && publication["note"] !== "") {
        str += '<span class="label label-success">' + publication["note"] + '</span> ';
    }

    return str;
}

function getReferenceForBook(publication) {
    var str = "";

    if("author" in publication && publication["author"] !== "") {
        str += publication["author"];

        if("year" in publication && publication["year"] !== "") {
            str += " (" + publication["year"] + ")";
        }

        str += ". ";
    }

    if("title" in publication && publication["title"] !== "") {
        str += publication["title"] + ". ";
    }

    if("publisher" in publication && publication["publisher"] !== "") {
        str += publication["publisher"] + ". ";
    }

    if("note" in publication && publication["note"] !== "") {
        str += '<span class="label label-success">' + publication["note"] + '</span> ';
    }

    return str;
}

function getBibtexForProceeding(publication, bibtex_key) {
    var bibtex = "@inproceedings{\n";
    bibtex += "    " + bibtex_key;

    if("author" in publication && publication["author"] !== "") {
        bibtex += ',\n    author = "' + publication["author"] + '"';
    }

    if("title" in publication && publication["title"] !== "") {
        bibtex += ',\n    title = "' + publication["title"] + '"';
    }

    if("booktitle" in publication && publication["booktitle"] !== "") {
        bibtex += ',\n    booktitle = "' + publication["booktitle"] + '"';
    }

    if("location" in publication && publication["location"] !== "") {
        bibtex += ',\n    location = "' + publication["location"] + '"';
    }

    if("month" in publication && publication["month"] !== "") {
        bibtex += ',\n    month = ' + publication["month"];
    }

    if("year" in publication && publication["year"] !== "") {
        bibtex += ',\n    year = ' + publication["year"];
    }

    if("numpages" in publication && publication["numpages"] !== "") {
        bibtex += ',\n    numpages = ' + publication["numpages"];
    }

    if("note" in publication && publication["note"] !== "") {
        bibtex += ',\n    note = "' + publication["note"] + '"';
    }

    bibtex += "\n}";

    return bibtex;
}

function getBibtexForArticle(publication, bibtex_key) {
    var bibtex = "@article{\n";
    bibtex += "    " + bibtex_key;

    if("author" in publication && publication["author"] !== "") {
        bibtex += ',\n    author = "' + publication["author"] + '"';
    }

    if("title" in publication && publication["title"] !== "") {
        bibtex += ',\n    title = "' + publication["title"] + '"';
    }

    if("journal" in publication && publication["journal"] !== "") {
        bibtex += ',\n    journal = "' + publication["journal"] + '"';
    }

    if("volume" in publication && publication["volume"] !== "") {
        bibtex += ',\n    volume = "' + publication["volume"] + '"';
    }

    if("number" in publication && publication["number"] !== "") {
        bibtex += ',\n    number = "' + publication["number"] + '"';
    }

    if("pages" in publication && publication["pages"] !== "") {
        bibtex += ',\n    pages = "' + publication["pages"] + '"';
    }

    if("month" in publication && publication["month"] !== "") {
        bibtex += ',\n    month = ' + publication["month"];
    }

    if("year" in publication && publication["year"] !== "") {
        bibtex += ',\n    year = ' + publication["year"];
    }

    if("numpages" in publication && publication["numpages"] !== "") {
        bibtex += ',\n    numpages = ' + publication["numpages"];
    }

    if("note" in publication && publication["note"] !== "") {
        bibtex += ',\n    note = "' + publication["note"] + '"';
    }

    bibtex += "\n}";

    return bibtex;
}

function getBibtexForTechReport(publication, bibtex_key) {
    var bibtex = "@techreport{\n";
    bibtex += "    " + bibtex_key;

    if("author" in publication && publication["author"] !== "") {
        bibtex += ',\n    author = "' + publication["author"] + '"';
    }

    if("title" in publication && publication["title"] !== "") {
        bibtex += ',\n    title = "' + publication["title"] + '"';
    }

    if("number" in publication && publication["number"] !== "") {
        bibtex += ',\n    number = "' + publication["number"] + '"';
    }

    if("institution" in publication && publication["institution"] !== "") {
        bibtex += ',\n    institution = "' + publication["institution"] + '"';
    }

    if("month" in publication && publication["month"] !== "") {
        bibtex += ',\n    month = ' + publication["month"];
    }

    if("year" in publication && publication["year"] !== "") {
        bibtex += ',\n    year = ' + publication["year"];
    }

    bibtex += "\n}";

    return bibtex;
}

function getBibtexForBook(publication, bibtex_key) {
    var bibtex = "@book{\n";
    bibtex += "    " + bibtex_key;

    if("author" in publication && publication["author"] !== "") {
        bibtex += ',\n    author = "' + publication["author"] + '"';
    }

    if("title" in publication && publication["title"] !== "") {
        bibtex += ',\n    title = "' + publication["title"] + '"';
    }

    if("year" in publication && publication["year"] !== "") {
        bibtex += ',\n    year = ' + publication["year"];
    }

    if("publisher" in publication && publication["publisher"] !== "") {
        bibtex += ',\n    publisher = ' + publication["publisher"];
    }

    bibtex += "\n}";

    return bibtex;
}

function getBibtexForCollection(publication, bibtex_key) {
    var bibtex = "@incollection{\n";
    bibtex += "    " + bibtex_key;

    if("author" in publication && publication["author"] !== "") {
        bibtex += ',\n    author = "' + publication["author"] + '"';
    }

    if("title" in publication && publication["title"] !== "") {
        bibtex += ',\n    title = "' + publication["title"] + '"';
    }

    if("booktitle" in publication && publication["booktitle"] !== "") {
        bibtex += ',\n    booktitle = "' + publication["booktitle"] + '"';
    }

    if("location" in publication && publication["location"] !== "") {
        bibtex += ',\n    location = "' + publication["location"] + '"';
    }

    if("month" in publication && publication["month"] !== "") {
        bibtex += ',\n    month = ' + publication["month"];
    }

    if("year" in publication && publication["year"] !== "") {
        bibtex += ',\n    year = ' + publication["year"];
    }

    if("pages" in publication && publication["pages"] !== "") {
        bibtex += ',\n    pages = ' + publication["pages"];
    }

    if("note" in publication && publication["note"] !== "") {
        bibtex += ',\n    note = "' + publication["note"] + '"';
    }

    bibtex += "\n}";

    return bibtex;
}

function getStringForPublication(publication) {
    var str = "";
    var bibtex = "";
    var bibtex_key = "";

    if("key" in publication && publication["key"] !== "") {
        bibtex_key = publication["key"];
    }
    else {
        bibtex_key = "" + Math.floor((Math.random() * 100000) + 1);
    }

    if("type" in publication && publication["type"] === "proceedings") {
        str = getReferenceForProceeding(publication);
        bibtex = getBibtexForProceeding(publication, bibtex_key);
    }
    else if("type" in publication && publication["type"] === "article") {
        str = getReferenceForArticle(publication);
        bibtex = getBibtexForArticle(publication, bibtex_key);
    }
    else if("type" in publication && publication["type"] === "techreport") {
        str = getReferenceForTechReport(publication);
        bibtex = getBibtexForTechReport(publication, bibtex_key);
    }
    else if("type" in publication && publication["type"] === "book") {
        str = getReferenceForBook(publication);
        bibtex = getBibtexForBook(publication, bibtex_key);
    }
    else if("type" in publication && publication["type"] === "collection") {
        str = getReferenceForProceeding(publication);
        bibtex = getBibtexForCollection(publication, bibtex_key);
    }
    else {
        return "";
    }

    if("links" in publication && typeof publication["links"] === "object") {
        for(key in publication["links"]) {
            if(publication["links"][key] !== "") {
                str += '[<a href="' + publication["links"][key] + '" target="_blank">' + key + '</a>] ';
            }
        }
    }

    str += '[<a class="cursor-pointer" data-toggle="modal" data-target="#bibtexModal" data-entry="' + bibtex_key + '">Bibtex</a>] ';

    str += '<span class="hide" id="' + bibtex_key + '">' + bibtex + '</span>';

    return str;
}
