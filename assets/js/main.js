const sheetId = '1rh9U8tGpCvuN4TA0t3fowZmvXwMDwA9yVE1RSkTBf0s';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'jpd-vocab';
const query = encodeURIComponent('Select *');
// const url = `${base}&sheet=${sheetName}&tq=${query}`;
const url = base;

function getData() {
    const data = [];
    return fetch(url)
        .then((res) => res.text())
        .then((rep) => {
            const jsData = JSON.parse(rep.substring(47, rep.length - 2));
            const colz = jsData.table.rows[0].c.map(obj => obj.v);
            delete jsData.table.rows[0];
            jsData.table.rows.forEach((main) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] =
                        main.c[ind] != null
                            ? main.c[ind].v == null
                                ? ''
                                : main.c[ind].v
                            : '';
                });
                data.push(row);
            });
            return data;
        });
}

async function typePractice() {
    const list = await getData();
    const length = list.length;
    let response;
    let words = render(list, length);
    document.getElementById('user-answer').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            let userAnswer = document.getElementById('user-answer').value;
            if (words.slice('/').includes(userAnswer)) {
                response = 'Your answer is correct!';
            } else {
                response = `<span class="wrong-answer">${userAnswer}</span> is wrong answer!<br>The answer is <span class="right-answer">${words}</span>`;
            }
            words = render(list, length, response);
        }
    });
}

function render(list, length, response) {
    if (response) {
        document.getElementById('response').innerHTML = response;
    }
    document.getElementById('user-answer').value = null;
    //let index = Math.floor(Math.random() * length);
    let index = list.length - 1;
    let words = list[index].word;
    let meaning = list[index].meaning;
    document.getElementById('vocab-question').innerHTML = meaning;
    document.getElementById('vocab-type-ipa').innerHTML = list[index].type + ' ' + list[index].ipa;
    document.getElementsByClassName('card__question')[0].style.backgroundImage = `url('${list[index].image}')`
    return words;
}

//window.addEventListener('DOMContentLoaded', typePractice);

typePractice()
