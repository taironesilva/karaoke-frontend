const dynamicTable = document.getElementById("dynamic-table");
let nao_encontrado = document.getElementById("nao-encontrado");

function search() {
  let tipo_pesquisa = document.getElementsByName("tipo_pesquisa");
  for (var i = 0; i < tipo_pesquisa.length; i++) {
    if (tipo_pesquisa[i].checked) {
      radioPesquisa = tipo_pesquisa[i].value;
    }
  }
  let text_pesquisa = document.getElementById("text_pesquisa");
  console.log(text_pesquisa.value.length);
  if (text_pesquisa.value == null || text_pesquisa.value.length == 0) {
    alert("O campo pesquisar não pode estar vazio");
  }
  if (text_pesquisa.value.length == 1) {
    alert("O campo pesquisar deve ter no mínimo 2 caracteres");
  } else {
    let radio = radioPesquisa;
    let text = text_pesquisa.value;
    searchInBd(radio, text);
  }
}

async function searchInBd(radio, text) {
  const response = await fetch(
    "https://karaoke-backend.cyclic.app/realizarConsulta",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        radio: radio,
        text: text,
      }),
    }
  );

  let result = await response.json();
  let json = result[0].registros;
  console.log(json.length);

  if (json.length == 0) {
    nao_encontrado.style.display = "block";
    dynamicTable.style.display = "none";
    console.log("entrou no if");
  } else {
    console.log("entrou no else");
    nao_encontrado.style.display = "none";
    dynamicTable.style.display = "block";
    mountTable(json);
  }
}

// dynamic-tables.js
const newTableRow = (callback) =>
  `
    <tr> 
        ${callback()}
    </tr>
    `;

const toTableHeader = (header) => `<th>${header}</th>`;

const toTableData = (header, value) => `<td>${value[header]}</td>`;

const getFormattedData = (headers, value) =>
  newTableRow(() =>
    headers.map((header) => toTableData(header, value)).join("")
  );

const getFormattedHeaders = (headers) =>
  newTableRow(() => headers.map(toTableHeader).join(""));

const getFormattedValues = (headers, values) =>
  values.map((value) => getFormattedData(headers, value)).join("");

const getTHead = (headers) =>
  `
        <thead>
            ${getFormattedHeaders(headers)}
        </thead>
    `;

const getTBody = (headers, values) =>
  `
        <tbody>
            ${getFormattedValues(headers, values)}
        </tbody>
    `;

const mountTable = (tableData) => {
  const headers = Object.keys(tableData[1]);

  const formattedHeaders = getTHead(headers);
  const formattedValues = getTBody(headers, tableData);

  dynamicTable.innerHTML = formattedHeaders + formattedValues;
};

const handleReaderLoad = (reader) => () => {
  const data = JSON.parse(reader.result);
  mountTable(data);
};
