// Copyright (c) FogCreek
// Source: BugEdit.js
//
// Original source code for drap and drop attachments handler.
//

var DragDropAttach = {

    fEnabled: true,
    cEntered: 0,
    cDrag: 0,
    mSel: null,
    dtLastShow: null,

    init: function () {

        if (!window.chrome && !(window.webkit && window.versionMajorWebKit >= 5)) {
            // Only Chrome and Safari are currently drag'n'drop attachment supported by us.
            return;
        }

        if (console.info) {
            console.info("Initializing custom implementation of DragDropAttach handler from FBMarkdown plugin.");
        }

        $(document.body).bind("dragstart", DragDropAttach.disable);
        $(document.body).bind("dragend", DragDropAttach.end);
        $(document.body).bind("dragenter", DragDropAttach.enter);
        $(document.body).bind("dragleave", DragDropAttach.leave);

        window.addEventListener("dragover", function (e) {
            e = e || event;
            // files will be droped over to input[type=file]
            if (e.target.tagName !== "INPUT") {
                console.log("Cancelling dragover event.");
                e.preventDefault();
            }
        }, false);
        window.addEventListener("drop", function (e) {
            e = e || event;
            // files will be droped over to input[type=file]
            if (e.target.tagName !== "INPUT") {
                console.log("Cancelling drop event.");
                e.preventDefault();
            }
        }, false);

    },

    hoverTarget: function (el, fHover) {
        if (!el) return;
        el.style.backgroundColor = fHover ? "#B1C9DD" : "#E0E9F1";
    },

    disable: function () {
        // Disable drag'n'drop if the drag is started on the page itself
        // (and not in external explorer window).
        DragDropAttach.fEnabled = false;
    },

    curr: function () {
        return DragDropAttach.mSel ? DragDropAttach.mSel.current_element : null;
    },

    enter: function (e) {

        if (!DragDropAttach.mSel) {
            try {
                frames.attachFrame.initMSel();
                DragDropAttach.mSel = frames.attachFrame.mSel;
            }
            catch (e) { };
        }

        DragDropAttach.addFocusHandlers();

        var el = DragDropAttach.curr();
        if (!window.macintosh && window.safari) {
            // Chrome doesn't properly handle the dataTransfer object yet (neither does Safari on Mac OSX).  
            // Once fixed, we can rely on dataTransfer.files.length to determine whether or not we're
            // dragging a file.
            DragDropAttach.fEnabled = DragDropAttach.fEnabled && e.originalEvent.dataTransfer.files.length > 0;
        }
        else {
            if (el && !el.fInDropTarget && $(e.srcElement).is("input, textarea")) {
                // Don't let drags start in textareas
                DragDropAttach.fEnabled = false;
            }
        }

        if (DragDropAttach.fEnabled) {
            function is_zoomed() {
                ////var actual = getActualStyle(el, "font-size");
                ////if (window.macintosh) {
                ////    return actual !== "11px";
                ////}

                ////return actual !== "13px";
                return false;
            }

            // If the page has been zoomed at all, don't allow drag'n'drop.  WebKit does not
            // handle page zooming on file input elements very well. bugzid:1952605
            // As soon as https://bugs.webkit.org/show_bug.cgi?id=45830 is fixed, we can remove this check.
            DragDropAttach.fEnabled = !is_zoomed();
        }
        if (!DragDropAttach.fEnabled) return;

        DragDropAttach.cEntered++;

        if (el && !el.fInDropTarget &&
            (!DragDropAttach.dtLastShow || ((new BrowserDate()) - DragDropAttach.dtLastShow > 250))) {
            try { frames.attachFrame.document.getElementById("clickMSel").onclick(); } catch (e) { };

            el.parentLast = el.parentNode;
            $(el).addClass("dropTarget");
            DragDropAttach.dtLastShow = new BrowserDate();

            var jelTarget = $("#idDropAttachments");
            if (jelTarget[0] && !jelTarget[0].fHoverBound) {
                jelTarget.bind(
                    "dragenter", function () { DragDropAttach.hoverTarget(this, true); }).bind(
                    "dragleave", function () { DragDropAttach.hoverTarget(this, false); });
                jelTarget[0].fHoverBound = true;
            }
            jelTarget.slideDown(50).append(el);

            el.fInDropTarget = true;
            DragDropAttach.cDrag++;

            if (el.onchange && !el.fOnChangeModified) {
                var fxnOnChangeOld = el.onchange;
                el.onchange = function () {
                    DragDropAttach.end.apply(el);
                    fxnOnChangeOld.apply(el);
                };
                el.fOnChangeModified = true;
            }
        }

        if (e.srcElement) e.srcElement.cDrag = DragDropAttach.cDrag;
    },

    leave: function (e) {

        if (DragDropAttach.cEntered <= 0) {
            // If 20ms from now a dragover event hasn't fired,
            // we've dragged back off the browser and into, say, an
            // explorer window.  Re-enable if necessary.
            // All of this should go away when Chromium gets its dataTransfer
            // object fixed.
            setTimeout(function () {
                try {
                    if (DragDropAttach.cEntered == 0) {
                        DragDropAttach.end.apply(DragDropAttach.curr());
                    }
                }
                catch (e) { }
            }, 20);
            return;
        }

        if (e.srcElement && e.srcElement.cDrag != DragDropAttach.cDrag) return;

        DragDropAttach.cEntered--;
        if (DragDropAttach.cEntered <= 0) {
            DragDropAttach.end.apply(DragDropAttach.curr());
        }

    },

    end: function (e) {
        if (this && this.fInDropTarget) {
            $(this).removeClass("dropTarget");
            $(this.parentLast).append(this);
            DragDropAttach.mSel.hideDiv(this.parentNode);
            this.fInDropTarget = false;
        }
        var jelTarget = $("#idDropAttachments");
        jelTarget.slideUp(50);
        DragDropAttach.hoverTarget(jelTarget[0], false);

        DragDropAttach.cEntered = 0;
        DragDropAttach.mSel = null;

        // Re-enable drag'n'drop after every drag end.
        DragDropAttach.fEnabled = true;
    },

    addFocusHandlers: function () {
        $("input[type='text'], input[type=''], textarea").each(function () {
            var el = this;
            if (!el.fDragDropHandlers && $(el).attr("type") != "file") {
                $(el).mouseover(function (e) {
                    if (DragDropAttach.curr() && DragDropAttach.curr().fInDropTarget) {
                        setTimeout(function () {
                            if ($(el).val().indexOf("file:///") > -1) {
                                // Hacky fix for any drop event that drops a file into an
                                // input box.  No events are fixed except for onmouseover
                                // in this case, and the file's path is dropped directly
                                // into the input box.
                                DragDropAttach.end.apply(DragDropAttach.curr());
                            }
                        }, 1);
                    }
                }).change(function () {
                    DragDropAttach.fEnabled = true;
                });

                el.fDragDropHandlers = true;
            }
        });
    }
};
