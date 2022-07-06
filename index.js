let button = document.getElementById('button')
let answer = document.getElementById('answer')

let questionInput = document.getElementById('questionInput')
let answerInput = document.getElementById('answerInput')
let questionAnswerInput = document.getElementById('questionAnswerInput')
let editSaveHiddenInput = document.getElementById('editSaveHiddenInput');

let cardList = document.getElementById('cardList');

// main array
let cardArray = JSON.parse(localStorage.getItem('card') || "[]");;

const printCards = () => {
    // if there is not element in the array, show no cards available
    if(cardArray.length===0){
        cardList.innerHTML = 
        `<div class="jumbotron bg-light text-center" style="padding:8rem;">
            <marquee direction='right' scrollamount='20'><h1>No cards available</h1></marquee>
        </div>`
        return;
    }
    // if any element exist, show it.
    let list = "";
    cardArray.forEach((val)=> {
        list += 
        `<div class="col-md-3">
            <div class="card card-body my-2">
                <h5 class='text-uppercase'>${val.question}</h5>
                <button class="btn btn-dark my-1" onclick="toggleAnswer('answer-${val.id}')" id="button" type="button">show/hide answer &#x2771;</button>
                <div class="alert alert-success d-none w3-animate-opacity my-1 text-capitalize" style="font-weight: bolder;" id="answer-${val.id}" role="alert">
                    ${val.answer}
                </div>
                <div class="mt-1">
                    <button class="btn btn-sm btn-success" onclick="editCard('${val.id}')">&#9988; Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCard('${val.id}')" style="float:right;">&#10005; Delete</button>
                </div>
            </div>
        </div>`
    })
    cardList.innerHTML = list;
}
printCards();

const editCard = (id) => {
    // find the index of the id so as to update
    const index = cardArray.findIndex(item => {
        return item.id == id;
    });
    // specially for edit
    questionAnswerInput.classList.contains('d-none')?questionAnswerInput.classList.remove('d-none'):null;

    questionInput.value = cardArray[index].question
    answerInput.value = cardArray[index].answer
    editSaveHiddenInput.value = index

}

const deleteCard = (id) => {
    if(!confirm('Are you sure want to delete')) return;
    let tempArray = cardArray.filter((item)=>item.id!=id);
    localStorage.setItem('card',JSON.stringify(tempArray));
    cardArray = [...tempArray];
    printCards();
    console.log(cardArray)
}

const saveQuestionAnswerCard = () => {
    let qValue = questionInput.value;
    let aValue = answerInput.value;
    // checking if the form is emtpy
    if(qValue===''||aValue===''){
        alert('Please fill the input!');
        return;
    }
    let temp = {};
    if(editSaveHiddenInput.value===''){
        // creating an object
        temp = {
            id : uuidv4(),
            question : qValue,
            answer : aValue,
            createdAt : Date.now()
        };
        // inserting object into the first index of array
        cardArray.unshift(temp);
    }
    else {
        cardArray[parseInt(editSaveHiddenInput.value)].question = qValue;
        cardArray[parseInt(editSaveHiddenInput.value)].answer = aValue;
        cardArray[parseInt(editSaveHiddenInput.value)].createdAt = Date.now();
    }
    // adding the array into localstorage so that it persist when refreshed.
    localStorage.setItem('card',JSON.stringify(cardArray));
    // print refreshed cards on the screen
    printCards();
    // clear input value and hide
    toggleQuestionAnswerInput();
}


// toggle -------------------------
const toggleQuestionAnswerInput = () => {
    let ref = questionAnswerInput.classList;
    ref.contains('d-none')?ref.remove('d-none'):ref.add('d-none');
    questionInput.value = '';
    answerInput.value = '';
    editSaveHiddenInput.value = '';
}
const toggleAnswer = (id) => {
    let ref = document.getElementById(id).classList;
    ref.contains('d-none')?ref.remove('d-none'):ref.add('d-none');

    cardArray.forEach((val)=>{
        if(id!='answer-'+val.id){
            document.getElementById('answer-'+val.id).classList.add('d-none');
        }
    })
}
// toggle end --------------------------



// creating unique id for the each note item
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}