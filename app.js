const weatherAPIKEY = '31fbaaafe2070ecfdcf75e10c228a0b7';
const degreeSymbol = String.fromCharCode(176);

const weatherOutput = document.querySelector('.weather-output');
const cityInput = document.querySelector('.city-input');
const form = document.querySelector('.form-cont');
const errSpan = document.querySelector('.err');
const weatherIcon = document.querySelector('description__img');
const loader = document.querySelector('.loader');

const handleError = (fn) => {
	return function (...params) {
		return fn(...params).catch(function (err) {
			console.error(err);
			errSpan.textContent = "We couldn't find that city!";
		});
	};
};

const weatherRequest = async () => {
	loader.style.display = 'block';

	if (cityValue === '') {
		errSpan.textContent = 'Please enter a city!';
		return;
	}
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${weatherAPIKEY}&units=${unitsValue}`,
		{
			mode: 'cors',
		}
	);
	const weatherData = await response.json();
	const temp = weatherData.main.temp;
	const feels_like = weatherData.main.feels_like;
	const cityName = weatherData.name;
	const description = weatherData.weather;

	display(temp, feels_like, cityName, description);
};

const safeWeatherRequest = handleError(weatherRequest);
let unitsValue = 'metric';

const getInput = () => {
	cityValue = cityInput.value;
	return cityValue;
};

const display = (temp, feels_like, cityName, description) => {
	loader.style.display = 'none';

	weatherOutput.style.display = 'flex';
	weatherOutput.querySelector('.temp__value').textContent = `${Math.round(temp)}${degreeSymbol}`;
	weatherOutput.querySelector('.feels-like__value').textContent = `${Math.round(feels_like)}${degreeSymbol}`;
	weatherOutput.querySelector('.city').textContent = cityName;

	description.forEach((element) => {
		weatherOutput.querySelector('.description').textContent += `${element.main} `;
		let weatherIconSrc = `http://openweathermap.org/img/wn/${element.icon}@2x.png`;
		weatherOutput.querySelector(
			'.description__img'
		).innerHTML += `<img src="${weatherIconSrc}" alt="${element.main} icon"></img>`;
	});
};

const resetValues = () => {
	weatherOutput.querySelector('.description__img').innerHTML = '';
	weatherOutput.querySelector('.description').textContent = '';
};

form.addEventListener('submit', (e) => {
	e.preventDefault();
	errSpan.textContent = '';
	resetValues();
	getInput();
	safeWeatherRequest();
	cityInput.value = '';
});

const units = document.querySelector('.units');

units.addEventListener('click', (e) => {
	if (e.target.classList.contains('imperial')) {
		e.target.classList.toggle('active');
		document.querySelector('.metric').classList.toggle('active');
		unitsValue = 'imperial';
		resetValues();
		safeWeatherRequest();
	} else if (e.target.classList.contains('metric')) {
		e.target.classList.toggle('active');
		document.querySelector('.imperial').classList.toggle('active');
		unitsValue = 'metric';
		resetValues();
		safeWeatherRequest();
	}
});
