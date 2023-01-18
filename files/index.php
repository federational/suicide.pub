<?php
/*
directory indexer

2007-12-16 Till Biedermann (tillbiedermann at yahoo dot de)


documentation
-------------
This is a small script which indexes the content of a given
directory (including the directories below). With the default
setup the script indexes the directory where it is located.
For configutation options, see the config section below.


changes
-------

2007-12-16
 - complete rewrite (merged the different versions)

2004-08-27
 - made the script working with register_globals=Off

2004-08-09
 - cleaned up the php and css code
 - valid xhtml 1.1 now


License
-------
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307,
USA.
*/


// configuration

$Root = realpath("."); // define the directory the index should be created for (can also be located outside the webserver root)

$AllowDownload = TRUE; // enclose file items with the anchor-tag (only makes sense when the files are in the webserver root)

$WebServerPath = dirname(getenv("SCRIPT_NAME")); // path where the indexed files can be accessed via a http URL (only required when $AllowDownload is TRUE)

$TitleStyle = "name"; // define the style of the title: "name", "relative" or "absolute", showing either the name of the directory, the relative or the absolute path

$ShowSelf = FALSE; // show this script in the listing (when it is inside the idexed directory)

$HideFileExtensions = FALSE; // hide the extensions of files

$SortBy = "name"; // sort order of the item list: sort by "name", "date" or "size"

// configuration end


// define working path
$path = $Root."/";
if (isset($_GET["p"])) {
    // decode get string
    $input = urldecode($_GET["p"]);
    // check input: accept only existing files inside the defined $Root
    if (($temp = realpath($path.$input)) and (strncmp($Root, $temp, strlen($Root)) == 0)) {
        $path = $temp."/";
    }
}
$rel_path = substr($path, strlen($Root) + 1);
// read items from current directory
$items = array();
foreach (scandir($path) as $item) {
    if (is_dir($path.$item) and ($item != ".") and ($item != "..")) {
        $index = "d";
    }
    elseif (!$ShowSelf and ($path.$item == __FILE__)) {
        continue;
    }
    elseif (is_file($path.$item)) {
        $index = "f";
    }
    else {
        continue;
    }
    $date = filemtime($path.$item);
    $size = filesize($path.$item);
    switch ($SortBy) {
        case "name":
            $index .= strtolower($item);
            break;
        case "date":
            $index .= strval($date).strtolower($item);
            break;
        case "size":
            $index .= strval($size).strtolower($item);
            break;
        default:
            die("unknown sort order: $SortBy");
            break;
    }
    $temp = pathinfo($path.$item);
    $items[$index]["name"] = ($HideFileExtensions and isset($temp["extension"])) ? substr($item, 0, (-1) * (strlen($temp["extension"]) + 1)) : $item;
    $items[$index]["filename"] = $item;
    $items[$index]["date"] = $date;
    $items[$index]["size"] = $size;
}
// sort items
ksort($items);
// generate title string
switch ($TitleStyle) {
    case "name":
        $title = basename($path);
        break;
    case "relative":
        $title = basename($Root)."/".$rel_path;
        break;
    case "absolute":
        $title = $path;
        break;
    default:
        die("unknown title style: $TitleStyle");
        break;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" >
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    <meta name="title" content="directory listing" />
    <meta name="description" content="directory listing" />
    <title>♥ 𝚜𝚞𝚒𝚌𝚒𝚍𝚎.𝚙𝚞𝚋 ♥</title>
    <link rel="stylesheet" href="assets/css/main.css" />
    <style type="text/css">
        :root {
          --bg-main: #000000;
          --bg-sec: #050505;
          --contrast: #202020;
          --accent: #cb3fa9;

          cursor: url('../cursor.cur'), auto;
        }

        @font-face {
          font-family: 'cut';
          src: url("../assets/cut.ttf");
        }

        body {
          background-color: var(--bg-main);
        }

        img {
            border: 0px;
            margin-top: 6px;
        }
        h2 {
            font-family: 'cut';
            color: var(--accent);
            letter-spacing: .2em;
            font-family: 'cut';
            padding: .2em;
            text-align: center;
            border-bottom: solid var(--contrast) 1px;
        }
        table {
            color: var(--accent);
            border-collapse: collapse;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 10px;
            border: solid var(--contrast) 1px;
        }
        th {
            font-family: 'cut';
        }
        td {
            padding: 2px 10px 2px 10px;
            background-color: var(--bg-sec);
            font-family: 'cut';
            border: solid var(--contrast) 1px;
        }
        a {
            text-decoration: none;
            font-family: 'cut';
            font-weight: bold;
            color: var(--accent);
        }
    </style>
</head>
<body>
<?php
echo "<h2>/$title/</h2>";
echo "<table>";
echo "<tr><th>name</th><th>size</th><th>date</th></tr>";
if ($path != $Root."/") {
    echo "<tr><td><a href=\"".getenv("SCRIPT_NAME")."?p=".urlencode(substr($rel_path, 0, (-1) * (strlen(basename($rel_path)) + 1)))."\">../</a></td><td></td><td></td></tr>";
}
foreach ($items as $index => $item) {
    echo "<tr><td>";
    if (substr($index, 0, 1) == "d") {
        echo "<a href=\"".getenv("SCRIPT_NAME")."?p=".urlencode($rel_path.$item["filename"])."\">".$item["name"]."</a>/";
    }
    elseif ($AllowDownload) {
        echo "<pre>".$item["name"]."<a href=\"http://".getenv("SERVER_NAME").$WebServerPath."/$rel_path".$item["filename"]."\" download> (↓)</a>";
    }
    else {
        echo $item["name"];
    }
    echo "</td><td>";
    if (substr($index, 0, 1) == "f") {
        if ($item["size"] > 1073741823) { $filesize = sprintf("%.1f", ($item["size"]/1073741824))." GB"; }
        elseif ($item["size"] > 1048575) { $filesize = sprintf("%.1f", ($item["size"]/1048576))." MB"; }
        elseif ($item["size"] > 1023) { $filesize = sprintf("%.1f", ($item["size"]/1024))." KB"; }
        else { $filesize = strval($item["size"]." byte"); }
        echo $filesize;
    }
    echo "</td><td>".gmdate("d M Y H:i",$item["date"])."</td></tr>";
}

?>
</body>
</html>