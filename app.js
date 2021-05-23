//define const
const SearchTerm = document.getElementById('search-term');
const SearchBtn = document.getElementById('search-btn');
const BadgeResult = document.getElementById('badge-result');
//functions
SearchBtn.addEventListener('click', ActionSearch);

function ActionSearch() {
  if (SearchTerm.value === '') {
    // console.log('empty search term');
    BadgeResult.innerHTML = '';
  } else {
    // console.log(SearchTerm.value);
    let url = 'http://localhost:3000/cities?q=' + SearchTerm.value;

    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.send();

    xhr.onload = function () {
      if (this.status === 200) {
        const jsonResult = JSON.parse(this.responseText);
        //console.log(jsonResult);
        // jsonResult.forEach(function (res) {
        //   console.log(res.name);
        // });
        let htmlResult = '';
        for (let i = 0; i < jsonResult.length; i++) {
          // console.log(jsonResult[i].name);
          htmlResult += `<a href="#" class="badge badge-light p-2 mr-3 mt-3">${jsonResult[i].name} (${jsonResult[i].country})</i>`;
        }
        BadgeResult.innerHTML = htmlResult;
      }
    };
  }
}
