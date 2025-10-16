using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Models
{
    public static class EmailTemplate
    {
        public static string GetHtml(string bodyContent, string headerColor, string iconEmoji)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f6fa;
            margin: 0;
            padding: 0;
            color: #333;
        }}
        .email-container {{
            max-width: 650px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            overflow: hidden;
        }}
        .header {{
            background-color: {headerColor};
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 20px;
            font-weight: 600;
        }}
        .header .icon {{
            font-size: 24px;
            margin-right: 8px;
            vertical-align: middle;
        }}
        .body {{
            padding: 25px 30px;
            line-height: 1.6;
            font-size: 15px;
        }}
        .body h2 {{
            color: {headerColor};
            border-bottom: 2px solid {headerColor};
            padding-bottom: 5px;
        }}
        .ticket-details {{
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }}
        .ticket-details li {{
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }}
        .ticket-details li b {{
            width: 140px;
            display: inline-block;
            color: #555;
        }}
        .footer {{
            background-color: #f0f0f0;
            text-align: center;
            padding: 15px;
            font-size: 13px;
            color: #777;
        }}
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='header'>
            <span class='icon'>{iconEmoji}</span>
            Support Ticket Notification
        </div>
        <div class='body'>
            {bodyContent}
        </div>
        <div class='footer'>
            &copy; {DateTime.Now.Year} Support Team. All rights reserved.
        </div>
    </div>
</body>
</html>";
        }


    }

}
