//define const
const SearchTerm = document.getElementById('search-term');
const SearchBtn = document.getElementById('search-btn');
const SearchResult = document.getElementById('search-result');

//functions
SearchBtn.addEventListener('click', ActionSearch);

//get Search Result Element
SearchResult.addEventListener('click', (e) => {
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
    console.log(lat + ' - ' + lng);

    // console.log(tzlookup(lat, lng));
    const locale = tzlookup(lat, lng);
    console.log(locale);

    // let dyear = spacetime.now(locale).format('year');
    // let dmonth = spacetime.now(locale).format('month-pad');
    // let dday = spacetime.now(locale).format('date-pad');
    const mydate = new Date();
    console.log(mydate);
    //console.log(dayjs.tz(mydate, locale).format('h:mm A'));
    // const test = new Date(dyear, dmonth, dday);
    // let date = new Date(2021, 28, 05);

    var coordinates = new adhan.Coordinates(lat, lng);
    var params = adhan.CalculationMethod.MuslimWorldLeague();
    params.madhab = adhan.Madhab.Hanafi;
    var prayerTimes = new adhan.PrayerTimes(coordinates, mydate, params);
    //console.log(dayjs.tz('2021-28-05 00:00', 'America/New_York'));
    let fajrTime = dayjs(prayerTimes.fajr).tz(locale).format('h:mm A');
    let sunriseTime = dayjs(prayerTimes.sunrise).tz(locale).format('h:mm A');
    let dhuhrTime = dayjs(prayerTimes.dhuhr).tz(locale).format('h:mm A');
    let asrTime = dayjs(prayerTimes.asr).tz(locale).format('h:mm A');
    let maghribTime = dayjs(prayerTimes.maghrib).tz(locale).format('h:mm A');
    let ishaTime = dayjs(prayerTimes.isha).tz(locale).format('h:mm A');
    console.log(fajrTime + '~' + sunriseTime + '~' + dhuhrTime + '~' + asrTime);
  }

  // console.log("test");
});

function ActionSearch() {
  SearchResult.innerHTML = '';
  if (SearchTerm.value === '') {
    console.log('empty search term');
    BadgeResult.innerHTML = '';
  } else {
    // console.log(SearchTerm.value);
    let url = 'http://localhost:3000/cities?q=' + SearchTerm.value;

    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.send();

    xhr.onload = function () {
      if (this.status === 200) {
        ShowResult(this.responseText);
      } else {
        console.log(this.statusText);
      }
    };
  }
}

function ShowResult(resultText) {
  const jsonResult = JSON.parse(resultText);
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
