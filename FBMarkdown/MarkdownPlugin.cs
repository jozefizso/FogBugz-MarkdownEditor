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
    public class MarkdownPlugin : Plugin, IPluginJS
    {
        public MarkdownPlugin(CPluginApi api) : base(api)
        {
        }

        public CJSInfo JSInfo()
        {
            var js = new CJSInfo();
            js.rgsStaticFiles = new[] { "js/FBMarkdown.js" };
            return js;
        }
    }
}
