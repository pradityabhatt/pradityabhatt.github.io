<?php

/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * author urvi patel(000770055)
 */

//student name validation
if (isset($_REQUEST['studentName'])) {
    if (preg_match("/[0-9]+/", $_REQUEST['studentName'])) {
        echo "1";
    } else if ($_REQUEST['studentName'] == "Harry Potter" || $_REQUEST['studentName'] == "Hermione Granger") {
        echo "2";
    } else if (strlen ($_REQUEST['studentName']) > 0) {
        echo "3";
    }
}

//student id validation
if (isset($_REQUEST['studentId'])) {
    if (!is_numeric($_REQUEST['studentId']) && (strlen($_REQUEST['studentId']) > 0)) {
        echo "1";
    } else if(preg_match("/[0-9]{9}/", $_REQUEST['studentId'])){   
        echo "2";
    } else if (strlen($_REQUEST['studentId']) > 0) {
        echo "3";
    }
}

//Student program validation
if (isset($_REQUEST['program'])) {
    if ($_REQUEST['program'] == "Geology" || $_REQUEST['program'] == "Microbiology") {
        echo "1";
    } else if ($_REQUEST['program'] == "Basket Weaving" || $_REQUEST['program'] == "Beanstalk Climbing") {
        echo "2";
    } else if (strlen($_REQUEST['program']) > 0) {
        echo "3";
    }
}
?>

