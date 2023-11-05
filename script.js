const API_KEY = "8ee37cfc5bfd706d93e221fce9ffb344";


 function renderWeatherInfo(data){
  let newPara = document.createElement('p');
  newPara.textContent = `${data?.main?.temp.toFixed(2)}°C`;
  document.body.appendChild(newPara);

}

async function fetchWeatherDetails(){
  try{
    let city ="sultanpur";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
       console.log("weather data:->" , data);
      
       renderWeatherInfo(data);
  }
  catch (err){

  }
  
}
async function getCustumWeatherDetails(){

  try{
    let lat = 88.63333;
    let lon= 18.333;
    
     let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
     let data = await result.json();
  
     console.log(data);
  }
  catch(err){
console.log("error found" , err);
  }
  
}