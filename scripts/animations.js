import Utilities from './Utilities.js';

class Animations {

    // the element where animations will be injected
    static background = document.querySelector('.js-animations');
    static foregroundImageElement = document.querySelector('.js-foregroundImage');

    // variable to save/clear lightning animation interval
    static lightningInterval;

    // color palette for clear sky background, dark to light
    static defaultColorPalette = [
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
        [101, 183, 246]
    ];

    // color palette for cloudy sky background, dark to light
    static defaultGrayScalePalette = [
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

    // clear all current particles
    static clearParticles(){
        const particles = Array.from(document.getElementsByClassName('js-gfx'));
        if(particles.length > 0){
            particles.forEach(el => el.remove());
        }
    }

    // pause all current particle animations
    static toggleParticleAnimations(){
        const particles = Array.from(document.getElementsByClassName('js-gfx'));
        if(particles.length > 0){
            particles.forEach(el => el.classList.toggle('paused'));
        }
    }

    // create new particles (Rain or Snow)
    static drawParticles(type, num){
    
        let classes = type === 'Rain' ? ['fas', 'fa-tint', 'rain', 'particle', 'js-gfx'] : ['fas', 'fa-snowflake', 'snow', 'particle', 'js-gfx'];
        let speed = type === 'Rain' ? 500 : 2000;

        // randomize each particle
        for(let x = 0; x < num; x++){
            let particle = document.createElement('i');
            particle.alt = ""; //allows screen readers to ignore particle
            particle.style.left = `${Math.floor(Math.random() * 100)}%`;
            particle.style.top = `${Math.floor(Math.random() * (20 - 10) + 10)}%`;
            particle.style.animationDelay = `${Math.floor(500 + (Math.random() * 1000))}ms`;
            particle.style.animationDuration = `${Math.floor(speed + (Math.random() * 1000))}ms`;
            classes.forEach(el => particle.classList.add(el));
            this.background.appendChild(particle);
        }
        
    }

    // determine number of clouds based on level of cloudiness (0-100%),
    // according to OpenWeather API status codes
    static getNumClouds(num){
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

    static drawClouds(numClouds, timezone){
    
        let num = numClouds;

        // num can only be a number between 1 and 5
        if(num < 0){
            num = 1;
        }

        if(num > 5){
            num = 5;
        }

        //randomize clouds
        let clouds = Utilities.shuffle([1,2,3,4,5]);

        const day = Utilities.isDay(timezone);

        // create clouds
        for(let x = 0; x < num; x++){
            let cloud = document.createElement('img');
            //clouds provided by https://www.youtube.com/watch?v=FWW38GuIo7M
            cloud.src = `../images/cloud${x + 1}.png`; 
            cloud.alt = ""; //allows screen readers to ignore clouds
            cloud.classList.add('cloud', `speed-${clouds[x]}`, 'js-gfx');
            // clouds have half-opacity at night time for aesthetic purposes
            if(!day){ cloud.classList.add('half-opacity'); }
            this.background.appendChild(cloud);
        }
        
    }

    static drawLightning(){
        const lightning = document.createElement('div');
        lightning.classList.add('lightning', 'js-gfx');
        this.background.appendChild(lightning);

        // reset
        if(this.lightningInterval){ clearInterval(this.lightningInterval); }

        // times were chosen to prevent constant flashing
        // and prevent animations being cut off between cycles
        setInterval(() => {
            setTimeout(() => {
                lightning.classList.add('lightning-animation');
                setTimeout(() => {
                    lightning.classList.remove('lightning-animation');
                }, 2000);
            }, (Math.random() * (12000 - 6000) + 6000)); 
            
        }, 6000); 
        
    }

    static drawAtmosphere(type){
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
        this.background.appendChild(atmosphereLayer1);

        const atmosphereLayer2 = document.createElement('div');
        atmosphereLayer2.classList.add('atmosphere', 'layer-2', `${weatherClass}-2`, 'fade', 'js-gfx');
        this.background.appendChild(atmosphereLayer2);
    }
    

    static animateWeatherGFX(weather, {id, timezone}){

        // reset
        this.clearParticles();

        switch (weather) {
            case 'Clouds':
              this.drawClouds(this.getNumClouds(id));
              break;
            case 'Thunderstorm':
              this.drawClouds(5, timezone);
              this.drawParticles('Rain', 100);
              this.drawLightning();
              break;
            case 'Drizzle':
              this.drawClouds(4, timezone);
              this.drawParticles('Rain', 30);
              break;
            case 'Rain':
              this.drawClouds(5, timezone);
              this.drawParticles('Rain', 100);
              break;
            case 'Snow':
              this.drawClouds(5, timezone);
              this.drawParticles('Snow', 80);
              break;
            case 'Mist':
            case 'Ash':
            case 'Fog':
            case 'Smoke':
            case 'Haze':
              this.drawClouds(3, timezone);
              this.drawAtmosphere('Fog');
              break;
            case 'Dust':
            case 'Sand':
              this.drawClouds(3, timezone);
              this.drawAtmosphere('Sand');
              break;
            case 'Squall':
            case 'Tornado':
            case 'Clear':
              break;
            default:
              console.error('Invalid weather condition.');
          }
        
    }

    // generate an array of times for each color 
    static getStages(startTime, endTime, numStages){
        const arr = [];
        const range = endTime - startTime;
        const fraction = range / numStages;
        for(let i = 0; i < numStages; i++){
            arr.push(Math.round((fraction * i) + startTime));
        }
        return arr;
    }

    // determine which two stages the current time is between 
    // or return -1 if current time is not between any stages
    // returns an array of objects containing the two stages 
    // as well as their indices in color palette
    static getNearestStages(stages, currentTime){
        for(let i = 0; i < stages.length - 1; i++){
            if(currentTime >= stages[i] && currentTime <= stages[i + 1]){
                return [{stage: stages[i], index: i}, {stage: stages[i + 1], index: i + 1}]; 
            }
        }
      
        return -1;
    }

    // calculate what % between nearest two stages current time is
    static percentToNextStage(a, b, c){
        return ((c - a) / (b - a)) * 100;
    }

    // calculate the color based on what % between nearest two stages current time is
    static calculateColor(colors, nearestStages, currentTime){
      
        const calc = (colorA, colorB, multiplicand) => {
            const val = Math.floor((colorA - colorB) * multiplicand + colorA);
            
            // prevent values from exceeding maximum RGB value
            if(val > 255){
                return 255;
            }

            return val;
        }
            
        
        let mult = this.percentToNextStage(nearestStages[0].stage, nearestStages[1].stage, currentTime) / 100;
  
        let colorA = colors[nearestStages[0].index];
        let colorB = colors[nearestStages[1].index];
    
        //an array of RGB values
        let newColor = [];
  
        newColor.push(calc(colorA[0], colorB[0], mult));
        newColor.push(calc(colorA[1], colorB[1], mult));
        newColor.push(calc(colorA[2], colorB[2], mult));
  
        return newColor;
         
    }

    // set the background to a new color
    static setColor(color){
        // use decimal to pick second shade for gradient that is ~10% darker than first shade
        const decimal = .9;
        this.background.style.background = `
          linear-gradient(to top, rgb(${color[0]}, ${color[1]}, ${color[2]}), rgb(${Math.floor(color[0] * decimal)}, ${Math.floor(color[1] * decimal)}, ${Math.floor(color[2] * decimal)})
        `;
    }

    static paintBackground(weather, {sunrise, sunset}, colorPalette = this.defaultColorPalette, grayScalePalette = this.defaultGrayScalePalette){

        // --- A Brief Explanation of animateSky() ---

        // (time calculatons are done in UNIX time)

        // sunrise & sunset are treated as an hour that is broken up into stages
        //   based on the number of colors in the given palette;
        //   each stage represents a point in time.
        
        // ex: if palette has 16 colors, then hour is broken up into 16 stages
        //   from start to end
        
        // the current time is checked against a list of stages (points in time), 
        //   and then a color is assigned based on what % of the way between two stages 
        //   the current time is
        
        // ex: if current time is 20% between stage 1 & stage 2 of the hour, then
        //   the color calculated will be the value that is 20% of the way between 
        //   palette[1] and palette[2], so if palette[1] has an R value of 100, 
        //   and palette[2] has an R value of 200, then the R value for the new color 
        //   will be 120.
        

        // reset
        this.background.style.background = '';
        this.foregroundImageElement.style.opacity = 1;
      
        // decide whether to use colors for clear sky or cloudy
        let colors = [];
      
        if(weather === 'Clear' || weather === 'Clouds'){
            colors = colorPalette;
        } else {
            colors = grayScalePalette;
        }

        // 3600, number of seconds in an hour
        const hour = 3600; 

        
        //get current timeUtilities.getDateTime(timezone)
        let currentTime = Math.floor(Date.now() / 1000); //change time here for testing i.e +(hour * 3)
        
        // --- Night ---
        // if the current time is less than sunrise, it's night
        if(currentTime < sunrise){
            // foregroundImageElement (hills) have opacity ajusted at different times
            //   for aesthetic purposes
            this.foregroundImageElement.style.opacity = 0.5;
            this.setColor(colors[0]);
            return;
        } 

        // --- Sunrise ---
        // if the current time is sunrise or equal to or less than an hour later than sunrise, it's sunrise
        if(currentTime >= sunrise && currentTime <= (sunrise + hour)){
            let stages = this.getStages(sunrise, sunrise + hour, colors.length);
            let nearestStages = this.getNearestStages(stages, currentTime);

            
            this.foregroundImageElement.style.opacity = 0.75;

            if(nearestStages === -1){
                this.setColor(colors[colors.length - 1]);
                return;
              }

            this.setColor(this.calculateColor(colors, nearestStages, currentTime));
            return;
        }

        // --- Day ---
        // if the current time is later than an hour after sunrise
        //   and less than hour before sunset, it's day
        if(currentTime > (sunrise + hour) && currentTime < (sunset - hour)){
            this.setColor(colors[colors.length - 1]);
            return;
        }

        // --- Sunset ---
        // if the current time is equal to or later than an hour before sunset
        //   and sooner than or equal to sunset, it's sunset
        if(currentTime >= (sunset - hour) && currentTime <= sunset){
            let stages = this.getStages(sunset - hour, sunset, colors.length);
            let nearestStages = this.getNearestStages(stages, currentTime);

            this.foregroundImageElement.style.opacity = 0.75;

            if(nearestStages === -1){
                this.setColor(colors[0]);
                return;
            }

            // for sunset, colors should transition from light to dark (reverse order of color palette)
            this.setColor(this.calculateColor(colors.slice().reverse(), nearestStages, currentTime));
            return
        }

        // --- Night ---
        // no other options
        this.foregroundImageElement.style.opacity = 0.5;
        this.setColor(colors[0]);
        return;

      }
}

export default Animations;