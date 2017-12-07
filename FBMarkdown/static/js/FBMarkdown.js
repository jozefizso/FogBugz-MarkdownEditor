/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/simplemde.d.ts" />
$(function () {
    $("#bugviewContainerEdit").on("dragenter", function (e) {
        $(e.currentTarget).addClass("dragover");
    }).on("dragleave", function (e) {
        $(e.currentTarget).removeClass("dragover");
    }).on("dragover", function (e) {
        e.preventDefault();
    }).on("drop", function (e) {
        e.preventDefault();
        var x = e.originalEvent;
        if (x.dataTransfer.files) {
            console.log("Dragged %i files.", x.dataTransfer.files.length);
        }
    });
    $(window).bind("BugViewChanging", function () {
        console.log('Markdown: event BugViewChanging');
    });
    $(window).bind("BugViewChange", function () {
        console.log('Markdown: event BugViewChange');
        var divModeSelector = $("div.editModeSelector");
        var spanMD = $("<span>")
            .addClass("virtualLink")
            .text("Markdown")
            .attr("title", "Markdown Editor")
            .appendTo(divModeSelector);
        var spanHTML = spanMD.prev().css("margin-right", 8).click(function () { spanMD.toggleClass("bold", false); });
        var spanPlain = spanHTML.prev().click(function () { spanMD.toggleClass("bold", false); });
        spanMD.click(function () {
            console.log('Activating Markdown editor...');
            spanPlain.toggleClass("bold", false);
            spanHTML.toggleClass("bold", false);
            spanMD.toggleClass("bold", true);
            var simplemde = new SimpleMDE({
                element: $("#sEventEdit")[0],
                spellChecker: false
            });
            simplemde.value("# Markdown\n* Hello World");
        });
    });
});
//# sourceMappingURL=FBMarkdown.js.map