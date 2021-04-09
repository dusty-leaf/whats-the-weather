import Utilities from './Utilities.js';

class Animations {
    /* constructor(background){
        this.background = background;
        this.clearSkies = [
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
            [101, 183, 246],
        ];
        this.graySkies = [
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
        this.lightningInterval = '';
    } */

    static background = document.getElementsByClassName('js-animations')[0];
    lightningInterval;

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

    static clearParticles(){
        const particles = Array.from(document.getElementsByClassName('js-gfx'));
        if(particles.length > 0){
            particles.forEach(el => el.remove());
        }
    }

    static toggleParticleAnimations(){
        const particles = Array.from(document.getElementsByClassName('js-gfx'));
        if(particles.length > 0){
            particles.forEach(el => el.classList.toggle('paused'));
        }
    }

    static drawParticle(type, num){
    
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
            this.background.appendChild(particle);
            /* setTimeout(() => {
                particle.remove();
            }, 60000);  */
        }
        
    }

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
            cloud.src = `../images/cloud${x + 1}.png`; //
            cloud.alt = ""; //allows screen readers to ignore clouds
            cloud.classList.add('cloud', `speed-${clouds[x]}`, 'js-gfx');
            if(!day){ cloud.classList.add('half-opacity'); }
            this.background.appendChild(cloud);
            /* setTimeout(() => {
                cloud.remove();
            }, 60000); */
        }
        
    }

    static drawLightning(){
        const lightning = document.createElement('div');
        lightning.classList.add('lightning', 'js-gfx');
        this.background.appendChild(lightning);

        if(this.lightningInterval){ clearInterval(this.lightningInterval); }
        setInterval(() => {
            setTimeout(() => {
                lightning.classList.add('lightning-animation');
                setTimeout(() => {
                    lightning.classList.remove('lightning-animation');
                }, 2000);
            }, (Math.random() * (22000 - 12000) + 12000));
            
        }, 12000);
        
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
        /* setTimeout(() => {
            atmosphereLayer1.remove();
        }, 60000); */

        const atmosphereLayer2 = document.createElement('div');
        atmosphereLayer2.classList.add('atmosphere', 'layer-2', `${weatherClass}-2`, 'fade', 'js-gfx');
        this.background.appendChild(atmosphereLayer2);
        /* setTimeout(() => {
            atmosphereLayer2.remove();
        }, 60000); */
    }
    

    static animateWeatherGFX(weather, {id, timezone}){

        // reset
        this.clearParticles();
    
        // const background = document.getElementById('weather')

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

    // determine which two stages the current time is between or return -1 if current time is not between any
    // returns an array of objects containing the two stages as well as their indices
    static getNearestStages(stages, currentTime){
        for(let i = 0; i < stages.length - 1; i++){
            //console.log(`current: ${current} - stage-${i}: ${stages[i]} / stage${i + 1}: ${stages[i + 1]}`);
            if(currentTime >= stages[i] && currentTime <= stages[i + 1]){
                //console.log('nearest stages ' + [stages[i - 1], stages[i]]);
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
    static calculateColor(colors, nearestStages){
      
        const calc = (colorA, colorB, multiplicand) => {
            const val = Math.floor((colorA - colorB) * multiplicand + colorA);
            if(val > 255){
                return 255;
            }
            return val;
        }
            
        console.log(nearestStages[0]);
        let mult = this.percentToNextStage(nearestStages[0].stage, nearestStages[1].stage, currentTime) / 100;
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
    static setColor(color){
        const fr = .9;
        this.background.style.background = `
          linear-gradient(to top, rgb(${color[0]}, ${color[1]}, ${color[2]}), rgb(${Math.floor(color[0] * fr)}, ${Math.floor(color[1] * fr)}, ${Math.floor(color[2] *fr)})
        `;
    }

    static animateSky(weather, {sunrise, sunset}, colorPalette = this.defaultColorPalette, grayScalePalette = this.defaultGrayScalePalette){
        // sunrise or sunset are treated as an hour that is broken up into stages.
        // each stage corresponds to a color from colors[]
        // the current time is checked against a list of stages, and then a color
        // is assigned based on what % of the way between two stages the current time is
        const hills = document.getElementById('weather__background');
      
        // reset
        this.background.style.background = '';
        hills.style.opacity = 1;
      
        let colors = [];
      
        if(weather === 'Clear' || weather === 'Clouds'){
            colors = colorPalette;
        } else {
            colors = grayScalePalette;
        }

      
        const hour = 3600; // 3600 = seconds per hour
      
        //get current time
        let currentTime = Math.floor(Date.now() / 1000); //change time here for testing i.e +(hour * 3)
      
        
        if(currentTime > (sunrise + hour) && currentTime < (sunset - hour)){
            //day
            this.setColor(colors[colors.length - 1]);
        } else if (currentTime < (sunrise + hour)){
            //sunrise
            let stages = this.getStages(sunrise, sunrise + hour, colors.length);
            let nearestStages = this.getNearestStages(stages, currentTime);
            if(nearestStages === -1){
              this.setColor(colors[colors.length - 1]);
              return;
            }
            this.setColor(this.calculateColor(colors, nearestStages));   
        } else if (currentTime >= (sunset - hour) && currentTime < sunset){
            //sunset
            let stages = this.getStages(sunset - hour, sunset, colors.length);
            let nearestStages = this.getNearestStages(stages, currentTime);
            if(nearestStages === -1){
                this.setColor(colors[0]);
                return;
            }
            this.setColor(this.calculateColor(colors.slice().reverse(), nearestStages));
        } else {
            //night
            this.setColor(colors[0]);
            hills.style.opacity = 0.5;
        }
      
        return;
      }
}

export default Animations;