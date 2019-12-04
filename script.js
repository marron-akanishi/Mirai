const URL = 'https://sparql.crssnky.xyz/spql/imas/query?output=json&force-accept=text%2Fplain&query=PREFIX%20schema%3A%20%3Chttp%3A%2F%2Fschema.org%2F%3EPREFIX%20rdf%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3EPREFIX%20imas%3A%20%3Chttps%3A%2F%2Fsparql.crssnky.xyz%2Fimasrdf%2FURIs%2Fimas-schema.ttl%23%3E%0ASELECT%20DISTINCT%20%3Fname%20(group_concat(%3Fm%3Bseparator%3D%22%2C%22)as%20%3Fmember)%20(group_concat(%3Fc%3Bseparator%3D%22%2C%22)as%20%3Fcolor)%0AWHERE%20%7B%0A%20%20%3Fu%20rdf%3Atype%20imas%3AUnit%3B%0A%20%20%20%20%20schema%3Aname%20%3Fname%3B%0A%20%20%20%20%20schema%3Amember%2Fschema%3Aname%7Cschema%3Amember%2Fschema%3AalternateName%20%3Fm.%0A%20%20%20%20%20filter(lang(%3Fm)%3D%22ja%22)%0A%20%20%7B%20SELECT%20%3Fm%20%3Fc%0A%20%20%20%20WHERE%7B%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%3Fi%20rdf%3Atype%20imas%3AIdol%3B%0A%20%20%20%20%20%20%20%20%20%20schema%3Aname%20%3Fm%3B%0A%20%20%20%20%20%20%20%20%20%20imas%3AColor%20%3Fc%3B%0A%20%20%20%20%20%20%20%20%20%20imas%3ATitle%20%3Ft.%0A%20%20%20%20%20%20%20%20%20%20filter(regex(%3Ft%2C%22765AS%22)%20%7C%7C%20regex(%3Ft%2C%22MillionStars%22))%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20UNION%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%3Fi%20rdf%3Atype%20imas%3AIdol%3B%0A%20%20%20%20%20%20%20%20%20schema%3AalternateName%20%3Fm%3B%0A%20%20%20%20%20%20%20%20%20imas%3AColor%20%3Fc.%0A%20%20%20%20%20%20%20%20%20filter(regex(%3Fm%2C%22%E3%82%B8%E3%83%A5%E3%83%AA%E3%82%A2%22))%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%7D%0A%7Dgroup%20by%20(%3Fname)%20order%20by(%3Fname)'
var units, images;

const addCard = (index, unit) => {
  //console.log(unit)
  document.querySelector("#list").insertAdjacentHTML('beforeEnd', `
  <div id="unit-${index}" class="card">
    <h5 class="card-header">${unit['name']['value']}</h5>
    <div class="card-body row">
    </div>
  </div>
  `)
  unit['member']['value'].split(",").forEach((name, i) => {
    let color = unit['color']['value'].split(",")[i]
    document.querySelector(`#unit-${index} > .card-body`).insertAdjacentHTML('beforeEnd', `
    <div class="col-auto idol-detail" style="background-color: #${color}">
      <img class="idol-icon" src="data:image/png;base64,${images[name]}" />
      <div class="idol-name">${name}</div>
    </div>
    `)
  })
}

// 検索
const searchIdol = () => {
  document.querySelector("#list").innerHTML = ""
  var searchText = document.querySelector('#search').value
  if (searchText != '') {
    let disp_list = units.filter((item, index) => {
      return item['member']['value'].indexOf(searchText) >= 0
    });
    disp_list.forEach((unit, i) => addCard(i, unit))
  } else {
    units.forEach((unit, i) => addCard(i, unit))
  }
};

window.onload = () => {
  fetch("idol.json").then((r) => {
    return r.json();
  }).then((data) => {
    //console.log(data)
    images = data;
  });
  fetch(URL).then((r) => {
    return r.json();
  }).then((data) => {
    units = data['results']['bindings'];
    units.forEach((unit, i) => {
      if (unit['member']['value'].indexOf("エミリースチュアート") >= 0) units[i]['member']['value'] = units[i]['member']['value'].replace("エミリースチュアート","エミリー")
      if (unit['member']['value'].indexOf("伴田路子") >= 0) units[i]['member']['value'] = units[i]['member']['value'].replace("伴田路子", "ロコ")
    })
    units.forEach((unit, i) => addCard(i, unit))
    $('#search').on('input', searchIdol);
  });
}