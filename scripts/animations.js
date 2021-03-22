// WEATHER

const animateWeatherGFX = (weather, weatherID) => {

    const background = document.getElementById('weather');

    const drawClouds = (numClouds) => {

        let num = numClouds;

        // num can only be a number between 1 and 5
        if(num < 0){
            num = 1;
        }

        if(num > 5){
            num = 5;
        }

        //randomize clouds

        //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        //https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
        function shuffle(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }

        let clouds = shuffle([1,2,3,4,5]);

        // create clouds
        for(let x = 0; x < num; x++){
            let cloud = document.createElement('img');
            //clouds provided by https://www.youtube.com/watch?v=FWW38GuIo7M
            cloud.src = `../images/cloud${x + 1}.png`; //
            cloud.alt = ""; //allows screen readers to ignore clouds
            cloud.classList.add('cloud', `speed-${clouds[x]}`, 'js-gfx');
            background.appendChild(cloud);
            setTimeout(() => {
                cloud.remove();
            }, 60000);
        }
        
    }

    const drawParticles = (type, num) =>{
    
        let classes = type === 'Rain' ? ['fas', 'fa-tint', 'rain', 'particle', 'js-gfx'] : ['fas', 'fa-snowflake', 'snow', 'particle', 'js-gfx'];
        let speed = type === 'Rain' ? 500 : 2000;

        for(let x = 0; x < num; x++){
            let particle = document.createElement('i');
            particle.alt = ""; //allows screen readers to ignore particle
            particle.style.left = `${Math.floor(Math.random() * 100)}%`;
            particle.style.top = `${Math.floor(Math.random() * (20 - 10) + 10)}%`;
            particle.style.animationDelay = `${Math.floor(500 + (Math.random() * 1000))}ms`;
            particle.style.animationDuration = `${Math.floor(speed + (Math.random() * 1000))}ms`;
            classes.forEach(el => particle.classList.add(el));
            background.appendChild(particle);
            setTimeout(() => {
                particle.remove();
            }, 60000); 
        }
        
    }

    const drawLightning = () => {
        setInterval(() => {
            background.classList.toggle('lightning');
        }, 3000);
        
    }

    const drawAtmosphere = (type) => {
        let weatherClass = '';

        if(!type){
            weatherClass = 'fog';
        }

        if(type === 'Sand' || type === 'Dust'){
            weatherClass = 'sand'; 
        } else {
            weatherClass = 'fog';
        }

        const atmosphereLayer1 = document.createElement('div');
        atmosphereLayer1.classList.add('atmosphere', 'layer-1', `${weatherClass}-1`, 'fade', 'js-gfx');
        background.appendChild(atmosphereLayer1);
        setTimeout(() => {
            atmosphereLayer1.remove();
        }, 60000);

        const atmosphereLayer2 = document.createElement('div');
        atmosphereLayer2.classList.add('atmosphere', 'layer-2', `${weatherClass}-2`, 'fade', 'js-gfx');
        background.appendChild(atmosphereLayer2);
        setTimeout(() => {
            atmosphereLayer2.remove();
        }, 60000);
    }
    

    //switch statment that draws weather affects based on weather
    // https://openweathermap.org/weather-conditions
// num = weatherID
const getNumClouds = (num) => {
    switch (num) {
      case 801:
        return 2;
      case 802:
        return 3;
      case 803:
        return 4;
      case 804:
        return 5;
      default:
        return 1;
    }
  };

  // switch statment that draws weather affects based on weather
  // https://openweathermap.org/weather-conditions
  switch (weather) {
    case 'Clouds':
      drawClouds(getNumClouds(weatherID));
      break;
    case 'Thunderstorm':
      drawClouds(5);
      drawParticles('Rain', 100);
      drawLightning();
      break;
    case 'Drizzle':
      drawClouds(4);
      drawParticles('Rain', 30);
      break;
    case 'Rain':
      drawClouds(5);
      drawParticles('Rain', 100);
      break;
    case 'Snow':
      drawClouds(5);
      drawParticles('Snow', 80);
      break;
    case 'Mist':
    case 'Ash':
    case 'Fog':
    case 'Smoke':
    case 'Haze':
      drawClouds(3);
      drawAtmosphere('Fog');
      break;
    case 'Dust':
    case 'Sand':
      drawClouds(3);
      drawAtmosphere('Sand');
      break;
    case 'Squall':
    case 'Tornado':
    case 'Clear':
      break;
    default:
      console.error('Invalid weather condition.');
  }
}

// SKY

const animateSky = (weather, sunrise, sunset) => {
  // sunrise or sunset are treated as an hour that is broken up into stages.
  // each stage corresponds to a color from colors[]
  // the current time is checked against a list of stages, and then a color
  // is assigned based on what % of the way between two stages the current time is
 
  const background = document.getElementById("weather"); //"content" // canvas

  // colors - dark (night) to light (day)
  const clearSkies = [
      [56, 51, 105],
      [106, 57, 116],
      [152, 63, 117],
      [192, 74, 109],
      [221, 95, 94],
      [233, 104, 109],
      [244, 113, 124],
      [255, 122, 139],
      [242, 130, 188],
      [206, 149, 227],
      [155, 168, 247],
      [101, 183, 246], //midday tone
  ];

  const graySkies = [
      [40, 39, 49],
      [51, 50, 59],
      [62, 61, 70],
      [73, 72, 81],
      [85, 84, 92],
      [97, 96, 103],
      [9, 108, 115],
      [122, 121, 127],
      [134, 134, 139],
      [147, 147, 151],
      [161, 160, 164],
      [174, 173, 176],
      [187, 187, 189],
      [201, 201, 202],
      [215, 215, 215]
  ];

  let colors = [];

  if(weather === 'Clear' || weather === 'Clouds'){
      colors = clearSkies;
  } else {
      colors = graySkies;
  }

  const hour = 3600; // 3600 = seconds per hour

  //get current time
  let currentTime = Math.floor(Date.now() / 1000); //change time here for testing i.e +(hour * 3)

  // generate an array of times for each color 
  const getStages = (startTime, endTime, numStages) => {
      const arr = [];
      const range = endTime - startTime;
      const fraction = range / numStages;
      for(let i = 0; i < numStages; i++){
          arr.push(Math.round((fraction * i) + startTime));
      }
      return arr;
  }
  

  // determine which two stages the current time is between or return -1 if current time is not between any
  // returns an array of objects containing the two stages as well as their indices
  const getNearestStages = (stages, currentTime) => {
      for(let i = 0; i < stages.length - 1; i++){
          //console.log(`current: ${current} - stage-${i}: ${stages[i]} / stage${i + 1}: ${stages[i + 1]}`);
          if(currentTime >= stages[i] && currentTime <= stages[i + 1]){
              //console.log('nearest stages ' + [stages[i - 1], stages[i]]);
              return [{stage: stages[i], index: i}, {stage: stages[i + 1], index: i + 1}]; 
          }
      }

      return -1;
  }

  //calculate what % between nearest two stages current time is
  const percentToNextStage = (a, b, c) => {
      return ((c - a) / (b - a)) * 100;
  }
  
  // calculate the color based on what % between nearest two stages current time is
  const calculateColor = (colors, nearestStages) => {

      const calc = (colorA, colorB, multiplicand) => {
          const val = Math.floor((colorA - colorB) * multiplicand + colorA);
          if(val > 255){
              return 255;
          }
          return val;
      }
          
      console.log(nearestStages[0]);
      let mult = percentToNextStage(nearestStages[0].stage, nearestStages[1].stage, currentTime) / 100;
      console.log(`factor: ${mult}`);

      let colorA = colors[nearestStages[0].index];
      let colorB = colors[nearestStages[1].index];
  
      //an array of RGB values
      let newColor = [];

      newColor.push(calc(colorA[0], colorB[0], mult));
      newColor.push(calc(colorA[1], colorB[1], mult));
      newColor.push(calc(colorA[2], colorB[2], mult));

      return newColor;
       
  }

  //assign those values to the background
  const setColor = (color) => {
      const fr = .9;
      background.style.background = `linear-gradient(to top, rgb(${color[0]}, ${color[1]}, ${color[2]}), rgb(${Math.floor(color[0] * fr)}, ${Math.floor(color[1] * fr)}, ${Math.floor(color[2] *fr)})`;
      console.log(`-----rgb(${color[0]}, ${color[1]}, ${color[2]})-----`);
  }

  if(currentTime > (sunrise + hour) && currentTime < (sunset - hour)){
      //day
      console.log('day');
      setColor(colors[colors.length - 1]);
  } else if (currentTime < (sunrise + hour)){
      //sunrise
      let stages = getStages(sunrise, sunrise + hour, colors.length);
      let nearestStages = getNearestStages(stages, currentTime);
      setColor(calculateColor(colors, nearestStages));   
  } else if (currentTime >= (sunset - hour) && currentTime < sunset){
      //sunset
      let stages = getStages(sunset - hour, sunset, colors.length);
      let nearestStages = getNearestStages(stages, currentTime);
      if(nearestStages === -1){
          setColor(colors[0]);
          return;
      }
      setColor(calculateColor(colors.slice().reverse(), nearestStages));
      console.log('dusk');
  } else {
      //night
      console.log('night');
      setColor(colors[0]);
  }

  
  return;
}

const clearParticles = () => {
    const particles = Array.from(document.getElementsByClassName('js-gfx'));
    if(particles.length > 0){
        particles.forEach(el => el.remove());
    }
    
}

export { animateWeatherGFX, animateSky, clearParticles };