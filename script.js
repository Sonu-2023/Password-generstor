const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;                 //all the initial values to be set
let checkCount =0;
handleSlider();
//set strength circle colour grey

setIndicator("#ccc");

//set password length  iska kaam itna he hai ke password chnge ko ui mein effect karata hai 
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
     //or kuch bhi karna chahiye ? - HW
     const min = inputSlider.min;
     const max = inputSlider.max;
     inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}

//colour set karenge strong ya loose password ka 
function setIndicator(color){
     indicator.style.backgroundColor = color;
     indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRanInteger(min , max){
    return Math.floor(Math.random() * [max-min]) + min ;

}

function generteRandomNumber(){
   return getRanInteger(0,9);
}

function generatelowercase(){
    return String.fromCharCode(getRanInteger(97 , 123) )   //this will give integer so change into character
}

function generateUppercase(){
    return String.fromCharCode(getRanInteger(65, 91) )
}

function generateSymbol(){
    const randNum = getRanInteger(0 , symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.data);
        copyMsg.innerText='copied';

    }
    catch(e){
        copyMsg.innerText='failed';
    }
    copyMsg.classList.add("active");

    setTimeout( () =>{
        copyMsg.classList.remove("active");
    } ,2000);
   

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}



function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength= e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click' , () =>{
    if(passwordDisplay.value)
       copyContent();
})

generateBtn.addEventListener('click' , () =>{

    //agar koi bhi checkbox checked nahi hai 
    if(checkCount==0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount ;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");

    //remove old password

    password ="";

    //lets put the stuffs mention by checkbox

    // if(uppercaseCheck.checked){
    //     password = generateUppercase();
    // }

    // if(lowercaseCheck.checked){
    //     password = generatelowercase();
    // }

    // if(numbersCheck.checked){
    //     password = generteRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password = generateSymbol();
    // }

    let funcArr =[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    
    if(lowercaseCheck.checked){
        funcArr.push(generatelowercase);
    }
    
    if(numbersCheck.checked){
        funcArr.push(generteRandomNumber);
    }
    
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsary condition
    for(let i=0 ; i<funcArr.length ; i++){
        password += funcArr[i]();
     }
    console.log("COmpulsory adddition done");

    //remainning additon

    for(let i=0 ; i<passwordLength-funcArr.length ;i++){
        let randIndex = getRanInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }



    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();

   
})