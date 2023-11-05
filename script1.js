const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-Container");
const grantAccessContainer = document.querySelector(".grantlocation-container");
const searchform = document.querySelector("[data-searchForm]");
const loading = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variable//
let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
 currentTab.classList.add("current-tab");
 getfromSessionStorage();
//  //ek kaam pending h//

function switchTab(clickedTab){
    if(clickedTab!= currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }

    if(!searchform.classList.contains("active")){
        //kya search wla form invisble to visible karna hoga//
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchform.classList.add("active");
    }
    else{
        // main pehle search wale tab pr tha ,ab your weather tab visible karna h //
        searchform.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }

}


 userTab.addEventListener("click",()=>{
    //pass  clicked tab as input parameter//
    switchTab(userTab);

    
 });

 searchTab.addEventListener("click",()=>{
    //pass  clicked tab as input parameter//
    switchTab(searchTab);
    
    
 });
 // - - - - - - - - - - - -User Weather Handling- - - - - - - - - - - -
const grantAccessBtn = document.querySelector("[data-grantAccess]");
const messageText = document.querySelector("[data-messageText]");

const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");

//check if cordinates are already present in  session storage //
 function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinate nhi mile//
        grantAccessContainer.classList.add("active");
    }
    else{
        //agar local coordinaes h//
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
 }

 async function  fetchUserWeatherInfo(coordinates) {
    const{lat, lon} = coordinates;
    //make grant conatainer invisible//
    grantAccessContainer.classList.remove("active");
    //make loader visible//
    loading.classList.add("active");

    //api call//

    try{
      const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      loading.classList.remove("active");
      //userinfo visible kro//
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);

    }
    catch(err){
        loading.classList.remove("active");
        console.log("error found" , err);
    }
    
 }


 //renderfunction//
 function renderWeatherInfo(weatherInfo){
    //fristly we have to fetch the element//
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const description = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temprature]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud =document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put it UI elements//
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText =`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo.main?.humidity}%`;
    cloud.innerText =  `${weatherInfo?.clouds?.all}%`;

 }
 function getLocation(){
    if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(showPostion);
    }
    else{
   
        // hw and show an alert for no geolocation support avilable//
        grantAccessBtn.style.display = "none";
        messageText.innerText = "Geolocation is not supported by this browser.";
  
    }
 }
 
function showPostion(position){
    const userCoordinates ={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
// Handle any errors
function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        messageText.innerText = "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        messageText.innerText = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        messageText.innerText = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        messageText.innerText = "An unknown error occurred.";
        break;
    }
  }


 //add eventlistnr at grantaccess button//
 const grantAccess = document.querySelector("[data-grantAccess]");
 grantAccess.addEventListener('click',getLocation);

 const searchInput =  document.querySelector("[data-searchInput]");

 searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName ==="")
    return;
    else
      fetchSearchWeatherInfo(cityName);

 })

 async function fetchSearchWeatherInfo(city){
     loading.classList.add("active");
     userInfoContainer.classList.remove("active");
     grantAccessContainer.classList.remove("active");

     
        try{
            
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
              const data = await response.json();
              loading.classList.remove("active");
              userInfoContainer.classList.add("active");
              
              
               renderWeatherInfo(data);
          }
          catch(err){
//hw//
           loading.classList.remove("active");
           apiErrorContainer.classList.add("active");
           apiErrorMessage.innerText = `${error?.message}`;
           apiErrorBtn.style.display = "none";
          }
    
  }