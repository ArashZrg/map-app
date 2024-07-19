'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = ((Date.now() + '').slice(-5) * 23) / 4.5;
  #coords;
  #distance;
  #duration;
  constructor(coords, distance, duration) {
    this.#coords = coords;
    this.#distance = distance;
    this.#duration = duration;
  }

  get getCoords() {
    return this.#coords;
  }

  get getDistance() {
    return this.#distance;
  }

  get getDuration() {
    return this.#duration;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.getDuration / this.getDistance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.clacSpeed();
  }

  clacSpeed() {
    this.speed = this.getDistance / (this.getDuration / 60);
    return this.speed;
  }
}

// test the classess
const run1 = new Running([39, -12], 5.2, 24, 178);
const cycle1 = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycle1);

//////////////////////////////
// Application
class App {
  // private fields
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();
    // submit event
    form.addEventListener('submit', this._newWorkout.bind(this));
    // change event on iputType
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert('could not get your position');
      });
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // we use map.on() function to add click event
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    //get data from the form
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    //check if data is valid

    // if activity is running : create running object
    if (type === 'running') {
      const cadence = Number(inputCadence.value);
      // Check if data is valid !
      if (
        typeof distance !== 'number' ||
        distance <= 0 ||
        typeof duration !== 'number' ||
        duration <= 0 ||
        typeof cadence !== 'number' ||
        cadence <= 0
      ) {
        return alert('Input shoud be a positive number !');
      }
    }
    // if activity is cycling : create cycling object
    if (type === 'cycling') {
      const elevation = Number(inputElevation.value);
      // check if data is valid !
      if (
        typeof distance !== 'number' ||
        distance <= 0 ||
        typeof duration !== 'number' ||
        duration <= 0 ||
        typeof elevation !== 'number' ||
        elevation <= 0
      ) {
        return alert('Input shoud be a positive number !');
      }
    }
    // add new object to workout array

    // render workout on map as marker
    const click_coords = [
      this.#mapEvent.latlng['lat'],
      this.#mapEvent.latlng['lng'],
    ];
    L.marker(click_coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();

    // render workout on list

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }
}

const app = new App();
