//define const
const SearchTerm = document.getElementById('search-term');
const SearchBtn = document.getElementById('search-btn');
const SearchResult = document.getElementById('search-result');
const TimeTable = document.getElementById('time-table');
const CityName = document.getElementById('city-name');
// const fileloc = 'test.json';
const fileloc = './node_modules/cities.json/cities.json';
//functions
SearchBtn.addEventListener('click', ActionSearch);

//get Search Result Element
SearchResult.addEventListener('click', (e) => {
  GetCityLoc(e);

  //remove hash on url bar
  setTimeout(() => {
    removeHash();
  }, 5);
});

function GetCityLoc(e) {
  e.preventDefault;
  e.stopPropagation;

  const info = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('badge');
    } else {
      return false;
    }
  });
  // console.log(info);

  if (info) {
    const lat = info.getAttribute('data-lat');
    const lng = info.getAttribute('data-lng');
    const city = info.getAttribute('data-cityName');
    //console.log(lat + ' - ' + lng);
    AppendPrayTimes(lat, lng, city);
  }
}

function AppendPrayTimes(lat, lng, city) {
  // console.log(tzlookup(lat, lng));
  const locale = tzlookup(lat, lng);
  // console.log(locale);
  const mydate = new Date();

  var coordinates = new adhan.Coordinates(lat, lng);
  var params = adhan.CalculationMethod.MoonsightingCommittee();
  params.madhab = adhan.Madhab.Hanafi;
  var prayerTimes = new adhan.PrayerTimes(coordinates, mydate, params);
  //console.log(dayjs.tz('2021-28-05 00:00', 'America/New_York'));
  const fajrTime = dayjs(prayerTimes.fajr).tz(locale).format('HH:mm');
  const sunriseTime = dayjs(prayerTimes.sunrise).tz(locale).format('HH:mm');
  const dhuhrTime = dayjs(prayerTimes.dhuhr).tz(locale).format('HH:mm');
  const asrTime = dayjs(prayerTimes.asr).tz(locale).format('HH:mm');
  const maghribTime = dayjs(prayerTimes.maghrib).tz(locale).format('HH:mm');
  const ishaTime = dayjs(prayerTimes.isha).tz(locale).format('HH:mm');
  //console.log(fajrTime + '/' + sunriseTime + '/' + dhuhrTime + '/' + asrTime);
  ClearPrayTable();
  const prayTimeTable = `
  <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Fajr</th>
                <th scope="col">Duhr</th>
                <th scope="col">Asr</th>
                <th scope="col">Magrib</th>
                <th scope="col">Isha</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>${fajrTime}</td>
                <td>${dhuhrTime}</td>
                <td>${asrTime}</td>
                <td>${maghribTime}</td>
                <td>${ishaTime}</td>
              </tr>
            </tbody>
          </table>
  `;
  CityName.innerHTML = `Pray Time in ${city} (${locale}), Today ${dayjs().format(
    'DD/MM/YYYY'
  )}.`;
  TimeTable.innerHTML = prayTimeTable;
}

function ClearPrayTable() {
  TimeTable.innerHTML = '';
  CityName.innerHTML = '';
}

function ClearSearchResult() {
  SearchResult.innerHTML = '';
  TimeTable.innerHTML = '';
  CityName.innerHTML = '';
}

function ActionSearch() {
  ClearSearchResult();

  let SearchText = SearchTerm.value;
  if (SearchText === '') {
    // console.log('empty search term');
    // BadgeResult.innerHTML = '';
  } else {
    // let url = 'http://localhost:3000/cities?q=' + SearchTerm.value;
    // const xhr = new XMLHttpRequest();
    // xhr.open('get', url, true);
    // xhr.send();
    // xhr.onload = function () {
    //   if (this.status === 200) {
    //     ShowResult(this.responseText);
    //   } else {
    //     console.log(this.statusText);
    //   }
    // };
    fetch(fileloc)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        let regex = new RegExp(SearchText, 'gi');
        let newData = [];

        data.forEach(function (val, key) {
          if (val.name.search(regex) != -1) {
            // console.log(val.name);
            let newObj = {};
            newObj.name = val.name;
            newObj.country = val.country;
            newObj.lat = val.lat;
            newObj.lng = val.lng;
            newData.push(newObj);
          }
        });
        if (newData.length >= 1) {
          ShowResult(newData);
        } else {
          // console.log('data not found');
          SearchResult.innerHTML = 'City name not found!';
        }
        // console.log(newData);
        //console.log(typeof newData);
      })
      .catch(function (err) {
        console.log(err);
      });

    // console.log(SearchText);
  }
}

function ShowResult(jsonResult) {
  //const jsonResult = JSON.parse(resultText);
  //console.log(jsonResult);
  // jsonResult.forEach(function (res) {
  //   console.log(res.name);
  // });
  for (let i = 0; i < jsonResult.length; i++) {
    // console.log(jsonResult[i].name);
    const SearchHref = document.createElement('a');
    SearchHref.href = '#';
    SearchHref.title = jsonResult[i].name;
    SearchHref.classList.add('badge', 'badge-light', 'p-2', 'mr-3', 'mt-3');
    SearchHref.setAttribute('data-cityName', jsonResult[i].name);
    SearchHref.setAttribute('data-lat', jsonResult[i].lat);
    SearchHref.setAttribute('data-lng', jsonResult[i].lng);
    const SearchNode = document.createTextNode(
      jsonResult[i].name + ' (' + jsonResult[i].country + ')'
    );
    SearchHref.appendChild(SearchNode);
    SearchResult.appendChild(SearchHref);
    // SearchResult.innerHTML += SearchHref;
    //console.log(SearchHref);
    //htmlResult += `<a href="#" class="badge badge-light p-2 mr-3 mt-3">${jsonResult[i].name} (${jsonResult[i].country})</i>`;
  }
}

function removeHash() {
  history.replaceState(
    '',
    document.title,
    window.location.origin + window.location.pathname + window.location.search
  );
}
