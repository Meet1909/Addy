$(function(){
  
  $("#NameSearch").geocomplete()
  .bind("geocode:result", function(event, result){
        $.log("Result: " + result.formatted_address);
        })
  .bind("geocode:error", function(event, status){
        $.log("ERROR: " + status);
        })
  .bind("geocode:multiple", function(event, results){
        $.log("Multiple: " + results.length + " results found");
        });
  });
