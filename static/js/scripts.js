function appendInputToChat() {
    userInput = document.getElementById("input").value;
    var temp = `<div class="chat-bubble chat-bubble-user">\
    <div class="chat-bubble-text-user">${userInput}</div></div>`
    document.getElementById('result').insertAdjacentHTML('afterbegin',temp);
    document.getElementById("input").value = '';
}