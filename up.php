<?php
$secret_key = "SECRETKEYHERE"; //Change this to your own secret key
$sharexdir = "i/"; //Change this to your desired image uploading directory
$domain_url = 'https://domain.com/'; //Change this to your domain (INCLUDE HTTPS:// IF YOU HAVE A SSL CERTIFICATE, OTHERWISE REMOVE "S")
$lengthofstring = 5; //Length of the randomized string name that will be assigned to the uploaded images

function RandomString($length) {
    $keys = array_merge(range(0,9), range('a', 'z'));

    $key = '';
    for($i=0; $i < $length; $i++) {
        $key .= $keys[mt_rand(0, count($keys) - 1)];
    }
    return $key;
}

if(isset($_POST['secret']))
{
    if($_POST['secret'] == $secret_key)
    {
        $filename = RandomString($lengthofstring);
        $target_file = $_FILES["sharex"]["name"];
        $fileType = pathinfo($target_file, PATHINFO_EXTENSION);

        if (move_uploaded_file($_FILES["sharex"]["tmp_name"], $sharexdir.$filename.'.'.$fileType))
        {
            echo $domain_url.$sharexdir.$filename.'.'.$fileType;
        }
            else
        {
           echo 'file upload failed - chmod/folder doesn\'t exist?';
        }
    }
    else
    {
        echo 'invalid secret key';
    }
}
else
{
    echo 'no post data recieved';
}
?>
