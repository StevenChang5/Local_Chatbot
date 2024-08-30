function appendInputToChat() {
    const parentDiv = document.getElementById("result");
    userInput = document.getElementById("input").value;
    var temp = `<div class="chat-bubble chat-bubble-user">\
    <div class="chat-bubble-text-user">${userInput}</div></div>`
    parentDiv.innerHTML += temp;
    document.getElementById("input").value = '';
}