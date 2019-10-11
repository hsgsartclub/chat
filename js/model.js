const model = {
    conversations: null, // cac cuoc hoi thoai cua nguoi dung
    currentConversation: null, // cuoc hoi thoai dang duoc hien thi
    profile: null
}

model.saveConversations = function(conversations) {
    model.conversations = conversations
}
model.saveCurrentConversation = function(conversation) {
    model.currentConversation = conversation
}
model.updateConversation = function(conversation) {
    let existedIndex = model.conversations.findIndex(function(element) {
        return element.id == conversation.id
    })
    
    if(existedIndex>=0) {model.conversations[existedIndex] = conversation} 
    else {model.conversations.push(conversation)}
}

model.removeConversation = function(conversation) {
    let existedIndex = model.conversations.findIndex(function(element) {
        return element.id == conversation.id 
    })
        if (existedIndex>=1) {
            model.conversations.splice(existedIndex, 1)
            model.conversations[existedIndex] = conversation
        }
}

// model.saveProfile = function(profile) {
//     model.profile = profile
// }
