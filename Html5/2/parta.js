/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * author: urvi patel(000770055)
 */
$(document).ready( function(){
    //this function is resetting all data every time according to form
    function resetData(id1,id2,id3){
        $(id1).html("");
        $(id2).removeClass().addClass("form-group row");
        $(id3).removeClass();
    };
    var flag = false;
    var flagName;
    var flagId ;
    var flagProgram;
    
    //Key up function for student name field like ajax function
    $("#studentName").keyup(function (){
       $.post(
               "parta.php",
               {
                   "studentName" : $("#studentName").val()
               },
               function(data){
                   flagName = false;
                   //if data passed by user for name is digit
                   if(data == 1){
                       $("#nameAlert").html("Student name cannot contain digits");
                       $("#nameGroup").removeClass().addClass("form-group row has-error has-feedback");
                       $("#nameIcon").removeClass().addClass("glyphicon glyphicon-remove form-control-feedback");
                   //if data is fictitious
                   }else if(data == 2){
                       $("#nameAlert").html("Student name may be fictitious");
                       $("#nameGroup").removeClass().addClass("form-group row has-warning has-feedback");
                       $("#nameIcon").removeClass().addClass("glyphicon glyphicon-warning-sign form-control-feedback");
                       flag = true;
                       flagName = true;
                   // if data is valid   
                   }else if(data == 3){ 
                       $("#nameAlert").html(" ");
                       $("#nameGroup").removeClass().addClass("form-group row has-success has-feedback");
                       $("#nameIcon").removeClass().addClass("glyphicon glyphicon-ok form-control-feedback");
                       flagName = true; 
                   }else{
                       resetData("#nameAlert", "#nameGroup","#nameIcon");
                   }       
               });
    });
    //Key up function for student id field like ajax function
    $("#studentId").keyup(function (){
       $.post(
               "parta.php",
               {
                   "studentId" : $("#studentId").val()
               },
               function(data){
                   flagId =false;
                   // if data has some text or characters
                   if(data == 1){
                       $("#idAlert").html("Student ID must only contain digits");
                       $("#idGroup").removeClass().addClass("form-group row has-error has-feedback");
                       $("#idIcon").removeClass().addClass("glyphicon glyphicon-remove-sign form-control-feedback");
                   //if data is repeatable
                   }else if(data == 2){
                       $("#idAlert").html("Student ID is suspicious");
                       $("#idGroup").removeClass().addClass("form-group row has-warning has-feedback");
                       $("#idIcon").removeClass().addClass("glyphicon glyphicon-warning-sign form-control-feedback");
                       flag = true;
                       flagId = true;
                   //if data is ok
                   }else if(data == 3){
                       $("#idAlert").html("");
                       $("#idGroup").removeClass().addClass("form-group row has-success has-feedback");
                       $("#idIcon").removeClass().addClass("glyphicon glyphicon-ok form-control-feedback");
                       flagId=true; 
                   }else{
                       resetData("#idAlert", "#idGroup","#idIcon");
                   }       
               });
    });
    //Key up function for student program field like ajax function
    $("#program").keyup(function (){
       $.post(
               "parta.php",
               {
                   "program" : $("#program").val()
               },
               function(data){
                   flagProgram =false;
                   //if program is not available
                   if(data == 1){
                       $("#programAlert").html("Program does not exist");
                       $("#programGroup").removeClass().addClass("form-group row has-error has-feedback");
                       $("#programIcon").removeClass().addClass("glyphicon glyphicon-remove-sign form-control-feedback");
                   //if program is fictitious
                   }else if(data == 2){
                       $("#programAlert").html("Program may be fictitious");
                       $("#programGroup").removeClass().addClass("form-group row has-warning has-feedback");
                       $("#programIcon").removeClass().addClass("glyphicon glyphicon-warning-sign form-control-feedback");
                       flag = true;
                       flagProgram = true;
                   //if program is ok
                   }else if(data == 3){
                       $("#programAlert").html("");
                       $("#programGroup").removeClass().addClass("form-group row has-success has-feedback");
                       $("#programIcon").removeClass().addClass("glyphicon glyphicon-ok form-control-feedback");
                       flagProgram=true; 
                   }else{
                       resetData("#programAlert", "#programGroup","#programIcon");
                   }       
               });
            });
    //when we hit submit button the data that we filled in form has to submit in table below that and here is the click event
    var textInfo; //information from form
    $("#submitButton").click(function(e) {
      e.preventDefault();
      if ( flagName && flagId && flagProgram ){
          var tableInfo = [$("#studentName").val(),$("#studentId").val(),$("#program").val()]
        
          if(flag){
              textInfo += '<tr class = "bg-warning">';
          }else{
              textInfo += "<tr>";
          }
          flag = false;
          for(var i = 0 ; i < 3 ; i++){
              textInfo += "<td>" + tableInfo[i] + "</td>";
          }
          textInfo += "</tr>";
          $("#tableContent").html(textInfo);
          
          resetData("#nameAlert", "#nameGroup","#nameIcon");
          resetData("#idAlert", "#idGroup","#idIcon");
          resetData("#programAlert", "#programGroup","#programIcon");
          $(':input').not(':submit').val('');
      }
   });
});


