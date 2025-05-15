const Container=document.querySelector(".container");
const chatsContainer=document.querySelector(".chats-container");
const promptForm=document.querySelector(".prompt-form");
const promptInput=promptForm.querySelector(".prompt-input");

const API_KEY="AIzaSyCPupk93uhN8bvrIl9UDApEUXQf5fKrLu8";
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;


let userMessage="";
const chatHistory=[];

const creatMsgElement=(content,...classes)=>{
    const div=document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML=content;
    return div;

}
 const scrollToBottom=()=>Container.scrollTo({top:Container.scrollHeight,behavior:"smooth"});
const typingEffect=(text,textElement,botMsgDiv)=>{
    textElement.textContent="";
    const words=text.split(" ");
    let wordIndex=0;

const typingInterval=setInterval(()=>{
    if(wordIndex < words.length)
    {
        textElement.textContent+=(wordIndex===0?" ":" ")+words[wordIndex++];
        scrollToBottom();

    }else{
        clearInterval(typingInterval);
        botMsgDiv.classList.remove("loading");
    }
},40);
}

const generateResponse=async(botMsgDiv)=>{
    const textElement=botMsgDiv.querySelector(".message-text");

    
    chatHistory.push({
        role:"user",
        parts:[{text:userMessage}]
    });
    try{
        const response=await fetch(API_URL,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({contents:chatHistory})
        });
        const data=await response.json();
        if(!response.ok)throw new Error(data.error.message);
 
       const responseText=data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g,"$1").trim();
       textElement.textContent=responseText;
       typingEffect(responseText,textElement,botMsgDiv);

    }catch(error){
        console.log(error); 

    
   }
}

const handleFormSubmit=(e)=>{
    e.preventDefault();
    userMessage=promptInput.value.trim();
    if(!userMessage) return;
    
    const userMsgHTML=`<p class="message-text"></p>`;
    const userMsgDiv=creatMsgElement(userMsgHTML,"user-message");

    userMsgDiv.querySelector(".message-text").textContent=userMessage;
    chatsContainer.appendChild(userMsgDiv);
    scrollToBottom();

    setTimeout(()=>{
        const botMsgHTML=`<img src="gemini.png" class="avatar"><p class="message-text">Just a sec...</p>`;
        const botMsgDiv=creatMsgElement(botMsgHTML,"bot-message","loading");
        chatsContainer.appendChild(botMsgDiv);
        scrollToBottom();
        generateResponse(botMsgDiv);
    
    },600);

}
promptForm.addEventListener("submit",handleFormSubmit);