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
</div>`;
const congratulation = document.querySelector('.congratulation');
let arr = localStorage.length ? JSON.parse(localStorage.getItem('words')) : [ ];
let update = false;

if  (localStorage.getItem('words') && localStorage.getItem('words').length > 2) {
    document.querySelector('.work-space').classList.remove('hide')
    document.querySelector('.create-new').classList.add('hide')
}

function renderTerm () {
    if (arr.length) {
        arr.forEach(item => {
            addTermElement(item);
        })
    } else {
        document.querySelector('.listing').innerHTML = autoTemplate
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
        },1200);
        document.querySelector('.update-item').innerHTML = '<ion-icon name="ellipsis-horizontal-outline"></ion-icon>'
    } else {const obj = {
        term : form.elements['term'].value.trim(), 
        mean : form.elements['mean'].value.trim()
    }
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
        if (update) {
            document.querySelector('.update-item').innerHTML = '<ion-icon name="ellipsis-horizontal-outline"></ion-icon>'
            form.reset();
            update = false;
        } else {let data = e.target.parentElement.parentElement.dataset.term;
            const target = arr.filter(item => {
                if (item.term === data) {
                    return item
                }
            });
            form.elements['term'].value = target[0].term;
            form.elements['mean'].value = target[0].mean;
            update = data;
            submitBtn.textContent = 'Adjust word';
            e.target.innerHTML = '<ion-icon name="close-outline" class="exit-update"></ion-icon>'
        }
    }
});
let controller = flipping(arr);

document.querySelector('.open-flipcard').addEventListener('click', function (e) {
    if (arr.length) {
    document.querySelector('.work-space').classList.add('out-slide');
    document.querySelector('.flip-container').classList.add('in-slide');
    document.querySelector('.flip-container').classList.remove('hide');
    document.querySelector('.move-back').classList.remove('hide')
    setTimeout(() => {
        document.querySelector('.work-space').classList.add('hide')
        document.querySelector('.work-space').classList.remove('out-slide');
        document.querySelector('.flip-container').classList.remove('in-slide')
    },500);
    controller = flipping(arr)
    controller.show(arr)
    } else {
        alert('Add some words!')
    }
})

document.querySelector('.clear-terms').addEventListener('click', function (e) {
    arr = [];
    localStorage.clear();
    console.log(localStorage);
    renderTerm();
})
/**
 * Thẻ prev hiển thị từ phía trước
 * Thẻ next hiển thị từ tiếp theo 
 * Bấm vào done và pass đều chạy tới từ tiếp theo
 * Bấm vào done thì xoá từ đó khỏi repeatingArr
 * Bấm vào pass thì thêm từ đó vào repeatingArr
 * Sau khi đã chạy hết từ trong mảng, hiển thị tiếp repeatingArr tới khi repeatingArr.length = 0
 * Bấm vào card thì card sẽ có hiệu ứng flip để hiển thị nghĩa 
 */

// FLIP CARD

function flipping (arr) {
    let arrClone = [...arr];
    let repeatingArr = [];
    let id = 0;
    const prev = document.querySelector('.prev')
    const next = document.querySelector('.next')
    const current = document.querySelector('.current')
        // Hiển thị ở prev và next
        // HIỂN THỊ Ở CURRENT
        return {
            show : function (newArr) {
                if (id > 0) {
                    prev.firstElementChild.textContent = newArr[id - 1].term;
                    prev.classList.remove('disable')

                } else {
                    prev.firstElementChild.textContent = "";
                    prev.classList.add('disable')
                }
                
                current.firstElementChild.textContent = newArr[id].term;
                current.lastElementChild.textContent = newArr[id].mean;

                if (id < newArr.length) {
                    if (id < newArr.length - 1) {
                        next.firstElementChild.textContent = newArr[id + 1].term;
                        next.classList.remove('disable');
                        [...document.querySelectorAll('.next-card')].forEach(item => {
                            item.classList.remove('disable')
                        })
                    } else {
                        next.firstElementChild.textContent = "";
                        next.classList.add('disable');
                    }
                    
                } else {
                    next.firstElementChild.textContent = "";
                    next.classList.add('disable');
                    [...document.querySelectorAll('.next-card')].forEach(item => {
                        item.classList.add('disable')
                    })
                }
            },
            nextCard : function (num) {
                if (num < 0) {
                    repeatingArr.push(arrClone[id])
                } 
                if (id < arrClone.length - 1) {
                  id++;  
                } else {
                    this.review();
                }
                this.show(arrClone);
            },
            move : function (num) {
                if (num < 0) {
                    id--;
                } else {
                    id++;
                }
                this.show(arrClone)
            },
            review : function () {
                if (repeatingArr.length) {
                    arrClone = [...repeatingArr];
                    repeatingArr = [];
                    id = 0;
                    [...document.querySelectorAll('.next-card')].forEach(item => {
                        setTimeout (function () {
                            item.firstElementChild.textContent = 0
                        })    
                    })
                    this.show(arrClone);
                } else {
                    id = 0;
                    setTimeout (function () {
                        document.querySelector('.congratulation').classList.add('is-shown');
                                            document.querySelectorAll('.next-card').forEach(item => {
                                                item.firstElementChild.textContent = 0;
                        })
                    })
                    
                }
            }
    }

}


document.querySelector('.flip-container').addEventListener('click',function (e) {
    if (e.target.matches('.next-card')) {
        if (e.target.matches('.done')) {
            controller.nextCard(1);
            value = +e.target.firstElementChild.textContent;
            e.target.firstElementChild.textContent = value+= 1;
            
        } else {
            controller.nextCard(-1);
            value = +e.target.firstElementChild.textContent;
            e.target.firstElementChild.textContent = value+= 1;
        }
        
    }
    if (e.target.matches('.flip-view')) {
        if (e.target.matches('.prev')) {
            controller.move(-1)
        } else {
            controller.move(1)
        }
    }
})


congratulation.addEventListener('click', function (e) {
    e.stopPropagation()
    if (e.target.matches('.congratulation-inner')){
        return
    } 
    closeNotification()
})

const confirmBtn = document.querySelector('.confirm');
confirmBtn.addEventListener('click', closeNotification)
function closeNotification() {
    congratulation.classList.add('congrats-close');
    setTimeout(function () {
        congratulation.classList.remove('is-shown');
        congratulation.classList.remove('congrats-close');
    },500);
}

document.querySelector('.current').addEventListener('click', flipTrigger)
async function flipTrigger () {
    document.querySelector('.current').classList.toggle('flip');
    document.querySelector('.current').style.pointerEvents = 'none'
    setTimeout(() => {
        document.querySelector('.current').style.pointerEvents = 'unset'
    },500) 
}

document.querySelector('.move-back').addEventListener('click', getBack)
function getBack () {
    document.querySelector('.flip-container').classList.add('hide');
    document.querySelector('.work-space').classList.remove('hide');
    document.querySelector('.move-back').classList.add('hide')
} 