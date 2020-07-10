 function loadDoc(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
              myFunction(this)
                
                //console.log(avg_temp_day);
            }
          };
          var city=document.getElementById('searchInput').value;
           xhttp.open("GET", "https://api.openweathermap.org/data/2.5/forecast?q=" + city
           +"&units=metric&appid=f5a0d51d72cc4d61b2f26e0dbcbcabd6&mode=xml", true);
            xhttp.send();
        }
          
         // console.log(xhttp);
         function myFunction(xml){
           var i;
           var xmlDoc = xml.responseXML;
           var x = xmlDoc.getElementsByTagName("weatherdata");
          // console.log(x);
           var x1 = x[0].getElementsByTagName('forecast')[0].getElementsByTagName('time');
           var wName = x1[0].getElementsByTagName('symbol')[0].getAttribute('name');
           colorChanger(wName);
           //console.log(wName);
           var storagesplit = [];
           var avg=[];
           for (i = 0; i < x1.length; i++){
             var datestart = x1[i].getAttribute('from').split('T');
             var symbol = x1[i].getElementsByTagName('symbol')[0].getAttribute('var');
             var tempstart = x1[i].getElementsByTagName('temperature')[0].getAttribute('value');
             var daytemp = new Date(datestart[0]);
             var daysplit = DayConvert(daytemp);
             storagesplit.push([datestart[0], datestart[1], parseFloat(tempstart), daysplit,symbol]);
           }
          // console.log(storagesplit);
         

           var sym= storagesplit[0][4];
          // console.log(sym);
            avg = countAvg(storagesplit);
            MINMAX(storagesplit);
            mchart(avg);
           //console.log(avg);
           document.getElementById('cityHeader').innerHTML = x[0].getElementsByTagName('name')[0].innerHTML;
           document.getElementById('temperature').innerHTML = parseInt(avg) + '&degC';
           document.getElementById('day').innerHTML = avg[0][1] ;
           document.getElementById('imga').innerHTML = '<img src="http://openweathermap.org/img/w/'+sym+'.png" >';
           document.getElementById('pressure').innerHTML = 'Pressure: ' + x[0].getElementsByTagName('pressure')[0].getAttribute('value') + ' '
            + x[0].getElementsByTagName('pressure')[0].getAttribute('unit') + '<br>';
           document.getElementById('humidity').innerHTML = 'Humidity: ' + x[0].getElementsByTagName('humidity')[0].getAttribute('value') + ' '
            + x[0].getElementsByTagName('humidity')[0].getAttribute('unit') + '<br>';
           document.getElementById('cloud').innerHTML = 'Cloud: ' + x[0].getElementsByTagName('clouds')[0].getAttribute('value') + '<br>';

           var val = '';
           for (i = 1; i < avg.length; i++) {
             var div1 = '<th><div class="weatherContainer">';
             var day = '<h1 id="cityHeader">' + avg[i][1] + '</h1>';
             var s = avg[i][2]
             var img = '<img src="http://openweathermap.org/img/w/'+s+'.png" >';
             var p = '<p ><b>' + parseInt(avg[i][0]) + '&degC</b></p>';
             
             val +=div1 + day + img + p ;
           }
           document.getElementById('thead1').innerHTML = '<td id="main_tree1">' + document.getElementById('main_tree1').innerHTML + '</td>' + val;


        }
        
        function DayConvert(daytemp) {
          day = daytemp.toString().split(' ');
          xy=day[0]
          return xy;
          
        }
        function countAvg(storageList) {

          var j = 0, i = 0;
          var count = 0;
          var avg = 0;
          var avg_temp = [];
          for (i = 0; i < storageList.length; i++) {

            if (storageList[j][0] == storageList[i][0]) {
              count++;
              avg += storageList[i][2];
            }
            else {
              avg_temp.push([avg / count, storageList[j][3] ,storageList[j][4]]);
              //console.log(avg_temp);
              count = 1;
              avg = storageList[i][2];
              j = i;
            }

          }
          avg_temp.push([avg / count, storageList[j][3], storageList[j][4]]);
          //console.log(avg_temp);

          return avg_temp;
        }
         function MINMAX(storageList) {

          var j = 0, i = 0;
          var count = 0;
          var avg = 0;
          var avg_temp = [];
          var avg =[];
          console.log(storageList);
          for (i = 0; i < storageList.length; i++) {

            if (storageList[j][0] == storageList[i][0]) {
              avg.push(storageList[i][2]);
              console.log(avg);
            }else
            {
              
             // console.log(avg_temp);
              j++;
              
             }
            avg_temp.push([avg]);
            console.log(avg_temp);

          }

          return avg_temp;
        }
        function mchart(avg) {
         // console.log(avg[0]);
          var data = {
            labels: [avg[0][1], avg[1][1], avg[2][1], avg[3][1], avg[3][1], avg[4][1]],
            datasets: [{
              label: "Dataset #1",
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 2,
              hoverBackgroundColor: "rgba(255,99,132,0.4)",
              hoverBorderColor: "rgba(255,99,132,1)",
              data: [avg[0][0], avg[1][0], avg[1][0], avg[2][0], avg[3][0], avg[4][0]] ,
            }]
          };

          var options = {
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                stacked: true,
                gridLines: {
                  display: true,
                  color: "rgba(255,99,132,0.2)"
                }
              }],
              xAxes: [{
                gridLines: {
                  display: false
                }
              }]
            }
          };
          
          var ctx = document.getElementById('myChart').getContext('2d');
          var myChart = new Chart.Bar(ctx, {options: options, data: data });
          
        }
        function colorChanger(wName) {
            switch (wName) {
              case "few clouds":
              case "overcast clouds":
              case "broken clouds":
              case "scattered clouds":
                document.body.style.backgroundImage = 'url("cloudy.jpg")';
                break;
              case "rain":
              case "shower rain":
              case "light rain":
                document.body.style.backgroundImage = 'url("rain.jpg")';
                break;
              case "clear sky":
                document.body.style.backgroundImage = 'url("clear.jpg")';
                break;
              case "snow":
                document.body.style.backgroundImage = 'url("snow.jpg")';
                break;
              case "mist":
                document.body.style.backgroundImage = 'url("rain.jpg")';
                break;
              case "thuderstorm":
                document.body.style.backgroundImage = 'url("strom.jpg")';
                break;
              default:
                document.body.style.backgroundImage = 'url("default.jpg")';
                break;
            }
          }