var city, title, weather5, forecast, tempToday;
var year, month, day, dayOfTheWeek, today;
var c = 1, f = 0;

function getinfo() {	
	city = document.getElementById("city").value;
	
	weather5 = document.getElementById("weather5");
	forecast = document.getElementById("forecast");
	
	now.style.display = "inline-block";
	
	while (weather5.firstChild) {
			weather5.removeChild(weather5.firstChild);
	}
	while (forecast.firstChild) {
		forecast.removeChild(forecast.firstChild);
	}
	
	document.getElementById("c").checked = true;
	document.getElementById("f").checked = false;
		
	update(city);
}

function enterKeyPressed(e)
{
    e = e || window.event;
    if (e.keyCode == 13)
    {
        document.getElementById('btn').click();
        return false;
    }
    return true;
}

function update(city){
	var weather = "http://api.openweathermap.org/data/2.5/weather?" +
		  "q=" + city +
		  "&APPID=27e50fa886cbec1a1d42fe2120cfe917" ;
		  
	var forecast = "http://api.openweathermap.org/data/2.5/forecast?" +
		  "q=" + city +
		  "&APPID=27e50fa886cbec1a1d42fe2120cfe917"  ;
	
	sendRequest(weather);	  	
	sendRequestForecast(forecast);	  
}

function sendRequest(api){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var data = JSON.parse(xmlhttp.responseText);
			console.log(data);
			tempToday = data.main.temp;
			document.getElementById("temperature").innerHTML = KelvinToC(); // temperature in Celsius by default
			document.getElementById("cityName").innerHTML = data.name + ", " + data.sys.country;
			today = data.dt;
			detectDay(today);
			document.getElementById("date").innerHTML = today;
			document.getElementById("image").innerHTML = "<img style = \"width: 50%\" src=\"images/" + data.weather[0].icon +".png\" /> "
			document.getElementById("description").innerHTML =  data.weather[0].description;
			document.getElementById("humidity").innerHTML = "Humidity: " + data.main.humidity + " %";
			document.getElementById("wind").innerHTML = "Wind: " + data.wind.speed + " mph";				
		}
	};
	
	xmlhttp.open ("GET", api, true);
	xmlhttp.send();
}

function sendRequestForecast(api){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			
			
			var data = JSON.parse(xmlhttp.responseText);
			console.log(data);
			
			
			for (var i = 1; i<data.list.length; i++){
				
				var newDay = data.list[i].dt;
				detectDay(newDay);
				
				var d = data.list[i].dt_txt;
				d = d.split(' ');
				if(d[1] == "12:00:00"){
					var div = document.createElement("div");
					
					var head = document.createElement("h2");
					var h2 = document.createTextNode(dayOfTheWeek);
					head.appendChild(h2);
					div.appendChild(head);
					
					var img = document.createElement("img");
					img.setAttribute('src', 'images/' + data.list[i].weather[0].icon + '.png');
					div.appendChild(img);
					img.setAttribute("id", "icon");
					
					var temp = document.createElement("p");
					var node = document.createTextNode((Math.round(data.list[i].main.temp - 273.15)) + " °C");
					temp.appendChild(node);
					temp.setAttribute("id", "temp");
					div.appendChild(temp);
					temp.className += "temp";
					
					var humid = document.createElement("p");
					var node = document.createTextNode("Humidity: "+ data.list[i].main.humidity + "%");
					humid.appendChild(node);
					div.appendChild(humid);
					humid.setAttribute("id", "humidity");
					
					var wind = document.createElement("p");
					var node = document.createTextNode("Wind: "+ data.list[i].wind.speed + "mph");
					wind.appendChild(node);
					div.appendChild(wind);
					wind.setAttribute("id", "wind");
				
					div.className += "data";
					weather5.appendChild(div);
					forecast.appendChild(weather5);
				}	
			}
		}
	};
	
	xmlhttp.open ("GET", api, true);
	xmlhttp.send();
}

function detectDay(date){
	var weekday = JSON.stringify(date);
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	var myDate = new Date(date*1000);
	dayOfTheWeek = days[myDate.getDay()];
	
	var day = new Date(today*1000);
	today = days[day.getDay()];
}

function KelvinToF(){
	f++;
	var temps = document.getElementsByClassName("temp");

	for(var i = 0; i < temps.length; i++){
		var t = temps[i].innerHTML;
		t = t.split(' ');
		t = t[0];

		if (f == 1){
			temps[i].innerHTML = Math.round(t*(9/5)+32) + " \&degF";
		}
	}
	c = 0;
	return document.getElementById("temperature").innerHTML = Math.round(tempToday*(9/5)-459.67) + "\&degF";
}

function KelvinToC(){			
	c++;
	var temps = document.getElementsByClassName("temp");
	for(var i = 0; i < temps.length; i++){
		var t = temps[i].innerHTML;
		t = t.split(' ');
		t = t[0];

		if (c == 1){
		temps[i].innerHTML = Math.round((t - 32) * (5/9)) + " \&degC";
		}				
	}
	f = 0;
	return document.getElementById("temperature").innerHTML = Math.round(tempToday - 273.15) + "\&degC";
}