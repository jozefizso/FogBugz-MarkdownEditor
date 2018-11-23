/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/simplemde.d.ts" />
$(function () {
    var gEditor = null;
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
        var spanHTML = spanMD.prev().css("margin-right", 8).click(function () {
            if (gEditor) {
                var text = gEditor.value();
                var html = gEditor.markdown(text);
                gEditor.toTextArea();
                gEditor = null;
                $("#sEventEdit").val(html).hide();
            }
            spanMD.toggleClass("bold", false);
        });
        var spanPlain = spanHTML.prev().click(function () {
            if (gEditor) {
                gEditor.toTextArea();
                gEditor = null;
            }
            spanMD.toggleClass("bold", false);
        });
        spanMD.click(function () {
            console.log('Activating Markdown editor...');
            spanPlain.toggleClass("bold", false);
            spanHTML.toggleClass("bold", false);
            spanMD.toggleClass("bold", true);
            if (!gEditor) {
                var simplemde = new SimpleMDE({
                    element: $("#sEventEdit")[0],
                    spellChecker: false,
                    status: false,
                    autofocus: true
                });
                gEditor = simplemde;
            }
        });
    });
});
//# sourceMappingURL=FBMarkdown.js.map