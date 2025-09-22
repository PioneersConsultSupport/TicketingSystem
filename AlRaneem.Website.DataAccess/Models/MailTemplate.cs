using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Models
{
    public static class EmailTemplate
    {
        public static string GetHtml(string bodyContent)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 6px;
        }}
        h2 {{
            color: #0073e6;
        }}
        ul {{
            padding-left: 20px;
        }}
        li {{
            margin-bottom: 6px;
        }}
        p {{
            margin-bottom: 10px;
        }}
    </style>
</head>
<body>
    <div class='container'>
        {bodyContent}
    </div>
</body>
</html>";
        }
    }

}
