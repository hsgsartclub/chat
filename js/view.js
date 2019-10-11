const view = {};
const validators = {
    require(str) {
        return str
    }, email(str) {
        return str.includes('@')
    }, password(str) {
        return str.length >= 6
    }
}

view.showComponent = function (name) {
    let app = document.getElementById('app')
    switch (name) {
        case 'register': {
            // display Register
            app.innerHTML = components.register;
            let link = document.getElementById('register-link')
            link.onclick = linkClickHandler

            let form = document.getElementById('register-form')
            form.onsubmit = formSubmitHandler

            function linkClickHandler() {
            view.showComponent('logIn');
            }

            function formSubmitHandler(event) {
                event.preventDefault()
                let registerInfo = {
                    firstname: form.firstname.value,
                    lastname: form.lastname.value,
                    email: form.email.value,
                    password: form.password.value,
                    confirmPassword: form.confirmPassword.value
                }
                let validateResult = [
                    view.validate(registerInfo.firstname, validators.require, 'firstname-error', 'Invalid first name'),
                    view.validate(registerInfo.lastname, validators.require, 'lastname-error', 'Invalid last name'),
                    view.validate(registerInfo.email, validators.email, 'email-error', 'Invalid email'),
                    view.validate(registerInfo.password, validators.password, 'password-error', 'Invalid password'),
                    view.validate(registerInfo.confirmPassword,
                        function (value) { return value && value == registerInfo.password },
                        'confirmPassword-error',
                        'Please check your password again')
                ]

                if (allPassed(validateResult)) {
                    controller.register(registerInfo)
                }
            }
            break
        }

        case 'logIn': {
            //display Log In
            app.innerHTML = components.logIn;
            let link = document.getElementById('log-in-link');
            link.onclick = linkClickHandler

            let form = document.getElementById('login-form')
            form.onsubmit = formSubmitHandler

            function linkClickHandler() {
                view.showComponent('register');
            }
            
            function formSubmitHandler(e) {
                e.preventDefault()
                let loginInfo = {
                    email: form.email.value,
                    password: form.password.value
                }

                let validateResult = [
                view.validate(loginInfo.email, validators.email, 'email-error', 'Invalid email'),
                view.validate(loginInfo.password, validators.password, 'password-error', 'Invalid password')
                ]
                if (allPassed(validateResult)) {
                    controller.logIn(loginInfo)
                }
            }
            break
        }

        case 'chat': {
            app.innerHTML = components.chat
            controller.loadConversation()
            controller.setupConversationsOnSnapshot()

            let nameDom = document.getElementById('user-display-name')
            nameDom.innerText = firebase.auth().currentUser.displayName

            let thisYear = new Date().getFullYear() 
            controller.getProfile(thisYear)

            let buttonChatroom = document.getElementById('buttonChatroom')
            buttonChatroom.onclick = linkClickHandler

            let buttonEditProfile = document.getElementById('buttonEditProfile')
            buttonEditProfile.onclick = linkClickHandlerEditProfile

            let buttonLeave = document.getElementById('leaveThisConversation')
            buttonLeave.onclick = leaveThisConversation

            let buttonSubmitLogout = document.getElementById('buttonSubmitLogout')
            buttonSubmitLogout.onclick = signOutHandler

            let formChat = document.getElementById('form-chat')
            formChat.onsubmit = formChatSubmitHandler

            let formAdd = document.getElementById('add-conversation-form')
            formAdd.onsubmit = formAddSubmitHandler

            function leaveThisConversation() {
                let user = firebase.auth().currentUser.email
                controller.leaveThisConversation(user, model.currentConversation.id)
            }

            function formChatSubmitHandler(e) {
                e.preventDefault()
                let content = formChat.message.value.trim()
                if(content) {
                    let message = {
                        owner: firebase.auth().currentUser.email,
                        createdAt: new Date().toISOString(),
                        content: content
                    }
                controller.addMessage(message)
                }
            }
            function linkClickHandler() {
                view.showComponent('chat');
            }

            function formAddSubmitHandler(e) {
                e.preventDefault() 
                let title = formAdd.title.value
                let friendEmail = formAdd.friendEmail.value

                let validateResult = [
                    view.validate(title, validators.require, 'title-error', 'Invalid title.'),
                    view.validate(friendEmail, validators.require, 'friend-email-error', 'Invalid email!')
                ]

                if (allPassed(validateResult)) {
                    let conversation = {
                        title: title, 
                        createdAt: new Date().toISOString(),
                        messages: [],
                        users: [
                            friendEmail, 
                            firebase.auth().currentUser.email
                        ]
                    }
                    controller.addConversation(conversation, friendEmail)
                }
            }
            function linkClickHandlerEditProfile() {
                view.showComponent('editProfile');
            }
            function signOutHandler() {
                firebase.auth().signOut()
            }

            break
        }

        case 'loading': {
            app.innerHTML = components.loading

            break
        }

        case 'editProfile': {
            app.innerHTML = components.editProfile

            let nameDom = document.getElementById('user-display-name')
            nameDom.innerText = firebase.auth().currentUser.displayName

            let thisYear = new Date().getFullYear() 
            controller.getProfile(thisYear)

            let formEdit = document.getElementById('edit-profile')
            formEdit.onsubmit = formEditSubmitHandler

            let buttonChatroom = document.getElementById('buttonChatroom')
            buttonChatroom.onclick = linkClickHandler

            let buttonEditProfile = document.getElementById('buttonEditProfile')
            buttonEditProfile.onclick = linkClickHandlerEditProfile

            let buttonSubmitLogout = document.getElementById('buttonSubmitLogout')
            buttonSubmitLogout.onclick = signOutHandler

            // let user = firebase.auth().currentUser;
            // let profileInfo = firebase.firestore().collection('profile').doc(user.email);

            function formEditSubmitHandler(e) {
                e.preventDefault()
                let user = firebase.auth().currentUser;
                let firstName = formEdit.editedFirstname.value;
                let lastName = formEdit.editedLastname.value;
                let yearOfBirth = formEdit.editedYear.value;
                let gender = formEdit.editedGender.value;
            // validate cac thong tin truoc khi edit
            let validateInfo = [
                view.validateInfoProfile(yearOfBirth, ''),
                view.validateInfoProfile(gender, '')
            ]
                
                if (allPassed(validateInfo)) {
                    let profileUser = {
                        user: firebase.auth().currentUser.email,
                        yearOfBirth: yearOfBirth, 
                        gender: gender
                    } 
                    view.setText('genderUser', profileUser.gender + ", ")
                        if (profileUser.yearOfBirth) {view.setText('ageUser', thisYear-profileUser.yearOfBirth)}
                        else {view.setText('ageUser', 'unknown')}
                    controller.addProfile(profileUser)
                    controller.getProfile(thisYear)
                } 

                if (firstName || lastName) {
                    let displayName = firstName + ' ' + lastName;
                    displayName.trim()
                    user.updateProfile({
                        displayName: displayName || user.displayName,
                        // photoURL: editProfile.photoURL || user.photoURL
                    })
                nameDom.innerHTML = displayName
                
                }
            }
                
            function linkClickHandlerEditProfile() {
                view.showComponent('editProfile');
            }
            function linkClickHandler() {
                view.showComponent('chat');
            }
            function signOutHandler() {
                firebase.auth().signOut()
            }


            break
        }
    }
}

view.setText = function (id, text) {
    document.getElementById(id).innerText = text
}

view.validate = function (value, validator, idErrorMessage, errorMessage) {
    if (validator(value)) {
        view.setText(idErrorMessage, '')
        return true
    } else {
        view.setText(idErrorMessage, errorMessage)
        return false
    }
}
view.validateInfoProfile = function (value, defaultValue) {
    if (value.trim() != "") {return true} 
    if (value.trim() == "") {value = defaultValue; return true}
}

view.disable = function(id) {
    document.getElementById(id).setAttribute('disabled', true)
}
view.enable = function(id) {
    document.getElementById(id).removeAttribute('disabled')
}

view.showCurrentConversation = function() {
    if(model.currentConversation) {
    //show all messages
    let messages = model.currentConversation.messages
    let conversation = model.currentConversation
    let messageContainer = document.getElementById('message-container')
    let chatName = document.getElementById('chat-name-display')

    chatName.innerHTML = conversation.title
    messageContainer.innerHTML = ""

    for (let message of messages) {
        let className = "message-chat"
        let content = message.content
        
        if(message.owner == firebase.auth().currentUser.email) {
            className = "your-message-chat"
        }

        let html = `
        <div class="${className}">
            <span>${content}</span>
        </div>
        `
        messageContainer.innerHTML += html
    }

    
    messageContainer.scrollTop = messageContainer.scrollHeight


    let users = model.currentConversation.users
    let createdAt = model.currentConversation.createdAt //check new Date().toLocaleString

    let emails = document.getElementById("email-chat")
    let date = document.getElementById("date-chat")
    emails.innerHTML = ''

    for (let email of users) {
        let html = `<div>${email}</div>`
        emails.innerHTML += html
    }
    let dateData = 'Created on ' + createdAt.substring(8, 10) + createdAt.substring(4, 8) + createdAt.substring(0, 4) + ' at ' + createdAt.substring(11, 16)
    date.innerHTML = dateData
  }
}

view.showConversationsList = function() {
    if(model.conversations) {
        let chatName = document.getElementById('chat-name-display')
        let conversationsList = document.getElementById('conversations-list')
        conversationsList.innerHTML = ''
        
        for (let conversation of model.conversations) {
            let className = "conversation"
            if (model.currentConversation && conversation.id == model.currentConversation.id) {
                className = "current"
            }

            let html = `
            <div id="title-${conversation.id}" class=${className}>
                <div class="conversation-title">${conversation.title}</div>
                <div class="conversation-members">${conversation.users.length} members</div>
            </div> 
            `
        conversationsList.innerHTML += html
        }

        for (let conversation of model.conversations) {
            let titleId = `title-${conversation.id}`
            let titleDiv = document.getElementById(titleId)
            titleDiv.onclick = onClickTitleHandler

            function onClickTitleHandler() {
                chatName.innerHTML = conversation.title
                model.saveCurrentConversation(conversation)
                view.showConversationsList()
                view.showCurrentConversation()
            }
        }
    }
}

// view.showDetail = function(users, createdAt) {
//     let emails = document.getElementById("email-chat")
//     let date = document.getElementById("date-chat")
//     emails.innerHTML = ''

//     for (let email of users) {
//         let html = `<div style="font-size: 12px">${email}</div>`
//         emails.innerHTML += html
//     }
//     let dateData = 'Created on ' + createdAt.substring(8, 10) + createdAt.substring(4, 8) + createdAt.substring(0, 4) + ' at ' + createdAt.substring(11, 16)
//     date.innerHTML = dateData
// }

function allPassed(validateResult) {
    for (let result of validateResult) {
        if (!result) {return false} else {return true}
    }
}



// nhung dieu chua hieu ro: 
// 1.Cach model hoat dong? (model.conversations, model.currenConversation...)
// 2. onSnapshot() la nhu the nao??

