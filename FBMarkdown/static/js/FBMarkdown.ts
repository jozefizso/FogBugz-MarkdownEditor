declare var $;

$(function () {
  
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

    let spanHTML = spanMD.prev().css("margin-right", 8).click(function () { spanMD.toggleClass("bold", false); });
    let spanPlain = spanHTML.prev().click(function () { spanMD.toggleClass("bold", false); });

    spanMD.click(function () {
      console.log('Activating Markdown editor...');

      spanPlain.toggleClass("bold", false);
      spanHTML.toggleClass("bold", false);
      spanMD.toggleClass("bold", true);
    });
  });
});

