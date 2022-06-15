const startBtn = document.querySelector('.create-new-session');
const form = document.querySelector('.adding-area');
const submitBtn = document.querySelector('.submit-btn')
const autoTemplate = `<div class='title flex-row'>
<div class='term-title double-col'>
    <Span>Term</Span>
</div>

<div class='mean-title mean double-col'>
    <Span>Meaning</Span>
</div>
</div>`
let arr = localStorage.length ? JSON.parse(localStorage.getItem('words')) : [ ];
let update = false;
function renderTerm () {
    if (arr.length) {
        arr.forEach(item => {
            addTermElement(item);
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
    if (update) {
        let id;
        arr.forEach(item => {
            if (item.term === update){
                id = arr.indexOf(item);
            }
        });
        arr[id].term = form.elements['term'].value;
        arr[id].mean = form.elements['mean'].value;
        localStorage.setItem('words',JSON.stringify([...arr]));
        update = false;
        submitBtn.textContent = 'Add';
        document.querySelector('.listing').innerHTML = autoTemplate;
        renderTerm();
        const elementList = document.querySelectorAll('.listing-item');
        elementList[id].classList.add('updated');
        setTimeout(function () {
            elementList[id].classList.remove('updated');
        },1200)
    } else {const obj ={
        term : form.elements['term'].value, 
        mean : form.elements['mean'].value
    };
    arr.push(obj);
    addTermElement(obj);
    localStorage.setItem('words',JSON.stringify([...arr]))}
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

    <div class="functions">
        <div class="update-item">
            <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
        </div>
        <div class="remove-item">
            <ion-icon name="trash-outline"></ion-icon>
        </div>
    </div>
    </div>
    `;
    document.querySelector('.listing').insertAdjacentHTML('beforeend',template)
}

document.body.addEventListener('click', function (e) {
    e.stopPropagation();
    if (e.target.matches('.remove-item')) {
        let data = e.target.parentElement.parentElement.dataset.term;
        arr = arr.filter(item => {
            return item.term !== data
        })
        localStorage.setItem('words',JSON.stringify([...arr]));
        document.querySelector('.listing').innerHTML = autoTemplate
        renderTerm()
    } else if (e.target.matches('.update-item')) {
        let data = e.target.parentElement.parentElement.dataset.term;
        const target = arr.filter(item => {
            if (item.term === data) {
                return item
            }
        });
        form.elements['term'].value = target[0].term;
        form.elements['mean'].value = target[0].mean;
        update = data;
        submitBtn.textContent = 'Adjust word'
    }
});

