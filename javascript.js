// finds all the cinemas from finnkino xml on when page is ready
$(document).ready(function() {
  $('.header').slideDown("slow");
  $("#selection").change(displayMovies);

  $.ajax({
      type: "GET",
      url: "https://www.finnkino.fi/xml/TheatreAreas/",
      dataType: "xml",
      success: function(xml) {


          // gets the needed elements from the xml data and adds them to variable

          // Spesific theatre IDs
          var id = $(xml).find('ID')
          var theatreName = $(xml).find('Name')

          // Loops all theatres and adds them to the options in dropdown menu
          for (var i = 0; i < theatreName.length; i++) {
              $('#city').append($('<option>').val(id[i].innerHTML).text(theatreName[i].innerHTML));
          }

      }
  });
});

//contacts another xml-page to find the upcoming dates
$.ajax({
  type: "GET",
  url: "https://www.finnkino.fi/xml/ScheduleDates/",
  dataType: "xml",
  success: function(xml) {

      //finds date from xml
      var dateTime = $(xml).find('dateTime');

      //finds startTime from dropdown menu

      var startTime = $("#startTime")[0]


      // loop for creating new options to startTime dropdown, for 8ish days
      for (var i = 0; i < 8; i++) {

          // fixes the time for later use in the URL using substringing

          var vuosi = $(dateTime[i]).contents().first().text().substring(0, 4);
          var kuukausi = $(dateTime[i]).contents().first().text().substring(5, 7);
          var paiva = $(dateTime[i]).contents().first().text().substring(10, 8);


          var uusiPaiva = paiva + "." + kuukausi + "." + vuosi;
          var properDate = vuosi + "/" + kuukausi + "/" + paiva;

          // makes a weekday for the day of the dropdown menu
          var viikonpaiva = new Date(properDate).toLocaleDateString('fi', {
              weekday: 'short'
          })

          var optionDate = document.createElement("option");

          optionDate.value = uusiPaiva;


          // creates a text node from the correct day and date


          var addDate = document.createTextNode(viikonpaiva + " " + uusiPaiva);
          startTime.appendChild(optionDate);
          optionDate.appendChild(addDate);
      }
  }
});


//Runs when dropdown menus change 
function displayMovies() {



  area = $("#city").val();
  startTime = $("#startTime").val();

  //adds the city and modified starttime to url to find area info from wanted date
  $.ajax({
      type: "GET",
      url: "https://www.finnkino.fi/xml/Schedule/?area=" + area + "&dt=" + startTime,
      dataType: "xml",
      success: function(customSchedule) {

          var table = "<tr><th>Elokuva</th><th>Teatteri</th><th>Genre ja ikäraja</th><th>Alkaa</th></tr>";
          var x = $(customSchedule).find('Show');

          for (i = 0; i < x.length; i++) {


              //adds film url, a small image, title of the film, theatre, rating, genre and starttime to the table
              table += "<tr><td id='center'><a target='_blank' id='center' href='" + x[i].getElementsByTagName("EventURL")[0].childNodes[0].nodeValue + "'>" +
                  "<img id='smallMedium' class='img-fluid relative' src=" +

                  x[i].getElementsByTagName("EventMediumImagePortrait")[0].childNodes[0].nodeValue + ">" + "<br>" +
                  x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue +
                  "</a" +
                  "</td><td>" +
                  x[i].getElementsByTagName("Theatre")[0].childNodes[0].nodeValue +
                  "</td><td>" + "<img id='small' class='img-fluid relative' src='" + x[i].getElementsByTagName("RatingImageUrl")[0].childNodes[0].nodeValue + "'>" + '<br>' +
                  x[i].getElementsByTagName("Genres")[0].childNodes[0].nodeValue +
                  "</td><td>" +
                  x[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue.substring(11, 16) +
                  "</td></tr>";



          }
          // adds loop results to id movies  
          $('#movies').fadeOut(1)
          $("#movies").html(table);
          $('#movies').fadeIn("slow");



      }
  })
}