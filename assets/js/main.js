const startBtn = document.querySelector('.create-new-session');
const form = document.querySelector('.adding-area');
let arr = localStorage.length ? JSON.parse(localStorage.getItem('words')) : [ ];
function renderTerm () {
    if (arr.length) {
        arr.forEach(item => {
            addTermElement(item);
            console.log(item)
        })
    } 
};

renderTerm();

startBtn.addEventListener('click', function (e) {
    document.querySelector('.work-space').classList.remove('hide')
    document.querySelector('.create-new').classList.add('hide')
})

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const obj ={
        term : form.elements['term'].value, 
        mean : form.elements['mean'].value
    };
    arr.push(obj);
    addTermElement(obj);
    console.log(obj)
    localStorage.setItem('words',JSON.stringify([...arr]))
    this.reset();
})

function addTermElement (item) {
    const template = `
    <div class="listing-item flex-row" data-term='${item.term}'>
    <div class="item-term double-col">
        ${item.term}
    </div>
    <div class="item-mean mean double-col">
        ${item.mean}
    </div>
    <div class="remove-item">
        <ion-icon name="trash-outline"></ion-icon>
    </div>
    </div>
    `;
    document.querySelector('.listing').insertAdjacentHTML('beforeend',template)
}

document.body.addEventListener('click', function (e) {
    e.stopPropagation();
    if (e.target.matches('.remove-item')) {
        let data = e.target.parentElement.dataset.term;
        arr = arr.filter(item => {
            return item.term !== data
        })
        localStorage.setItem('words',JSON.stringify([...arr]));
        document.querySelector('.listing').innerHTML = `<div class='title flex-row'>
                        <div class='term-title double-col'>
                            <Span>Term</Span>
                        </div>

                        <div class='mean-title mean double-col'>
                            <Span>Meaning</Span>
                        </div>
                        </div>`
        renderTerm()
    }
}) 