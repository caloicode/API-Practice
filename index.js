import express from 'express';
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index.ejs')
});


// $$openweathermap
const URL_OPENWEATHERMAP = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/openweathermap', (req, res) => {
    
    res.render('openweathermap.ejs')
})

app.get('/back_openweathermap', (req, res) => {
    // res.render('openweathermap.ejs')
    res.redirect('/')
})

app.post('/weather', async (req, res) => {
    var city = req.body.city;
    city = city.split(' ').join('+');
    // console.log(city);
    var unit = req.body.unit;

    function getUnit(u) {
        switch (u) {
            case "metric":
                return "°C"
                break;

            case "imperial":
                return "°F"
            default:
                break;
        }
    }
    var unitOutput = getUnit(unit)

    try {
        const response = await axios.get(`${URL_OPENWEATHERMAP}?q=${city}&appid=${process.env.appID_OPENWEATHERMAP}&units=${unit}`);
        const result = response.data;
        // console.log(result);

        res.render('openweathermap.ejs', {
            weatherData: result,
            unit: unitOutput
        });
    } catch (error) {
        console.error('Failed to make request:', error.message);

        res.render('openweathermap.ejs', {
            error: error.response.data
        });
    }
})

// $$bionic reading
app.get('/bionicreading', (req, res) => {
   res.render('bionicreading.ejs')
})

app.post('/postText', async (req, res) => {
    const text = req.body.text;

    const encodedParams = new URLSearchParams();
    encodedParams.set('content', text);
    encodedParams.set('response_type', 'html');
    encodedParams.set('request_type', 'html');
    encodedParams.set('fixation', '1');
    encodedParams.set('saccade', '10');
    
    const options = {
      method: 'POST',
      url: 'https://bionic-reading1.p.rapidapi.com/convert',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.API_KEY_BIONICREADING,
        'X-RapidAPI-Host': 'bionic-reading1.p.rapidapi.com'
      },
      data: encodedParams,
    };
    
    try {
        const response = await axios.request(options);
        const result = response.data
        
        res.render('bionicreading.ejs', {
            content: result
        })
        // console.log(response.data);
    } catch (error) {
        console.error(error);
    }
})




app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});