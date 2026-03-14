// Fruit Quiz System

const quizQuestions = [
{
question: "What is your favorite fruit?",
options: ["Apple","Banana","Mango","Orange"],
correct: 1
},

{
question: "Which fruit is the sweetest?",
options: ["Banana","Orange","Lemon","Apple"],
correct: 0
},

{
question: "Which fruit is the sourest?",
options: ["Lemon","Apple","Banana","Mango"],
correct: 0
},

{
question: "What fruit is red?",
options: ["Strawberry","Banana","Kiwi","Durian"],
correct: 0
},

{
question: "What fruit is yellow?",
options: ["Banana","Apple","Grape","Cherry"],
correct: 0
},

{
question: "What fruit is purple?",
options: ["Grape","Banana","Orange","Mango"],
correct: 0
},

{
question: "Do you like mangoes?",
options: ["Yes","No"],
correct: 0
},

{
question: "Ananas comosus is the scientific name of which fruit?",
options: ["Pineapple","Apple","Pear","Grape"],
correct: 0
},

{
question: "Fragaria × ananassa is which fruit?",
options: ["Strawberry","Cherry","Apple","Orange"],
correct: 0
},

{
question: "Psidium guajava is which fruit?",
options: ["Guava","Pear","Banana","Apple"],
correct: 0
},

{
question: "Which fruit has many seeds?",
options: ["Watermelon","Banana","Mango","Apple"],
correct: 0
},

{
question: "Which fruit has a strong smell?",
options: ["Durian","Apple","Pear","Grape"],
correct: 0
},

{
question: "What color is dragon fruit inside?",
options: ["White or Red","Blue","Yellow","Green"],
correct: 0
},

{
question: "What fruit has the most water?",
options: ["Watermelon","Banana","Durian","Mango"],
correct: 0
},

{
question: "What fruit is good for smoothies?",
options: ["Banana","Garlic","Potato","Onion"],
correct: 0
}

];

let currentQuiz = null;

function loadQuizQuestion(){

const randomIndex = Math.floor(Math.random()*quizQuestions.length);
currentQuiz = quizQuestions[randomIndex];

const q = document.getElementById("quiz-question");
const optionsDiv = document.getElementById("quiz-options");
const feedback = document.getElementById("quiz-feedback");
const nextBtn = document.getElementById("quiz-next");

q.textContent = currentQuiz.question;
optionsDiv.innerHTML = "";
feedback.textContent="";
nextBtn.style.display="none";

currentQuiz.options.forEach((opt,index)=>{

const btn=document.createElement("button");
btn.className="btn btn-shop";
btn.textContent=opt;

btn.onclick=()=>checkQuizAnswer(index);

optionsDiv.appendChild(btn);

});

}

function checkQuizAnswer(index){

const feedback=document.getElementById("quiz-feedback");
const nextBtn=document.getElementById("quiz-next");

if(index===currentQuiz.correct){

feedback.textContent="✅ Correct! +10 coins";

const money=document.getElementById("money");
money.textContent=parseInt(money.textContent)+10;

}else{

feedback.textContent="❌ Wrong answer";

}

nextBtn.style.display="block";

}

document.getElementById("quiz-next").onclick=loadQuizQuestion;

document.addEventListener("DOMContentLoaded",loadQuizQuestion);