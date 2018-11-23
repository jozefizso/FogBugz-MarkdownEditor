using System;
using System.Collections.Generic;
using System.Text;
using FogCreek.FogBugz;
using FogCreek.FogBugz.Plugins;
using FogCreek.FogBugz.Plugins.Api;
using FogCreek.FogBugz.Plugins.Entity;
using FogCreek.FogBugz.Plugins.Interfaces;

namespace FBMarkdown
{
    public class MarkdownPlugin : Plugin, IPluginCSS, IPluginJS
    {
        public MarkdownPlugin(CPluginApi api) : base(api)
        {
        }

        public CCSSInfo CSSInfo()
        {
            var js = new CCSSInfo();
            js.rgsStaticFiles = new[]
            {
                "css/simplemde.css",
                "css/md.css"
            };
            return js;
        }

        public CJSInfo JSInfo()
        {
            var js = new CJSInfo();
            js.rgsStaticFiles = new[]
            {
                "js/BugEdit.js",
                "js/simplemde.debug.js",
                "js/FBMarkdown.js"
            };
            return js;
        }
    }
}
