<?php

$password = "root";

$hashpwd = password_hash($password, PASSWORD_DEFAULT);

echo $hashpwd

?>