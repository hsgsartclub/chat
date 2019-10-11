const controller = {};
controller.initAuth = function ()
{
    view.showComponent('loading')
    firebase.auth().onAuthStateChanged(onAuthStateChangedHandler)
    function onAuthStateChangedHandler(user) {
        if (user && user.emailVerified) {
            view.showComponent('chat')
        } else {
            view.showComponent('logIn')
        }
    }
}
controller.register = async function(registerInfo) {
    let email = registerInfo.email
    let password = registerInfo.password
    let displayName = registerInfo.firstname + " " + registerInfo.lastname
    let button = document.getElementById('buttonSubmitRegister')

    button.setAttribute('disabled', true)
    view.setText('register-error', '')
    view.setText('register-success', '')

    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        await firebase.auth().currentUser.updateProfile({
            displayName: displayName
        })
        await firebase.auth().currentUser.sendEmailVerification()
        view.setText('login-success', 'Check your verification email')
    } catch (error) {
        view.setText('register-error', error.message)
    }
    button.removeAttribute('disabled')
}

controller.logIn = async function(loginInfo) {
    let email = loginInfo.email
    let password = loginInfo.password
    let button = document.getElementById('buttonSubmitLogin')

    button.setAttribute('disabled', true)
    view.setText('login-error', '')
    view.setText('login-success', '')

    try {
        let result = await firebase.auth().signInWithEmailAndPassword(email, password)
        if(!result.user || !result.user.emailVerified) {
            throw new Error('Please verify your email!')
        }
    }   catch(error) {
        view.setText('login-error', error.message)
        button.removeAttribute('disabled')
    }
}

controller.loadConversation = async function() {
    
    let result = await firebase
        .firestore()
        .collection('conversations') 
        .where('users', 'array-contains', firebase.auth().currentUser.email) // load only conversation with users including user's email
        .get()
    let conversations = []

    for (let doc of result.docs) {
        let conversation = doc.data()
        conversation.id = doc.id
        conversations.push(conversation)
    }

    model.saveConversations(conversations) 
    if (conversations.length) {
        model.saveCurrentConversation(conversations[0])
    }

    view.showCurrentConversation()
    view.showConversationsList()
}

controller.addMessage = async function(message) {
let input = document.getElementById('form-chat-input')
view.disable('buttonSubmitSend')
    await firebase
    .firestore()
    .collection('conversations')
    .doc(model.currentConversation.id)
    .update({
        messages: firebase.firestore.FieldValue.arrayUnion(message)
    })
    
view.enable('buttonSubmitSend')
input.value = ''
}

controller.setupConversationsOnSnapshot = function() {
    firebase
    .firestore()
    .collection('conversations')
    .where('users', 'array-contains', firebase.auth().currentUser.email) // load only conversation with users including user's email
    .onSnapshot(snapshotHandler)

    
    function snapshotHandler(snapshot) {
        let docChanges = snapshot.docChanges()
        for (let docChange of docChanges) {
            let conversation = docChange.doc.data()
            conversation.id = docChange.doc.id

            if (docChange.type == 'modified') {
                model.updateConversation(conversation)
                if (conversation.id == model.currentConversation.id) {
                    model.saveCurrentConversation(conversation)
                    view.showCurrentConversation() 
                }
            }
            if (docChange.type == 'added') {
                model.updateConversation(conversation)
            }
            if (docChange.type == 'removed') {
                model.removeConversation(conversation)
                if(isCurrentConversation(conversation)) {
                    if (model.conversations.length) {
                        model.saveCurrentConversation(model.conversations[0])
                    } else {
                        model.saveCurrentConversation(null)
                    }
                    view.showCurrentConversation()
                }
            }
        }
        view.showConversationsList()
    } 
}

controller.addConversation = async function(conversation, friendEmail) {
// HW (04/10/2019)
// find existed users
// display error message + disable button when submit
view.disable('buttonAddSubmit')
try {
        let signInMethods = await firebase.auth().fetchSignInMethodsForEmail(friendEmail)
        if (!signInMethods.length) {
            throw new Error('invalid email')
        } 
        if (friendEmail == firebase.auth().currentUser.email) {
            throw new Error('Please enter another email')
        }

        await firebase
        .firestore()
        .collection('conversations')
        .add(conversation)
    document.getElementById('form-add-input-title').value = ''
    document.getElementById('form-add-input-email').value = ''

    let conversationsList = document.getElementById('conversations-list')
    conversationsList.scrollTop = conversationsList.scrollHeight
    } catch(error) {view.setText('friend-email-error', error.message)}
    view.enable('buttonAddSubmit')
}

controller.addProfile = async function(profileUser) {
    try {
        await firebase
        .firestore()
        .collection('profile')
        .doc(firebase.auth().currentUser.email)
        .set(profileUser)
    } catch(error) {console.log(error)}
}

controller.getProfile = async function(thisYear) {
    await firebase.firestore()
    .collection('profile')
    .doc(firebase.auth().currentUser.email)
    .get().then(function(doc) {
        if (doc.exists) {

            if (doc.data().yearOfBirth.trim()) {
                var ageData = thisYear - doc.data().yearOfBirth 
            } else { var ageData = 'unknown'}

            if (doc.data().gender.trim()) {
                var genderData = doc.data().gender + ", ";
            } else {var genderData = 'unknown'}

            view.setText('ageUser', ageData)
            view.setText('genderUser', genderData)
        } else {
            let reminderProfile = document.getElementById('reminderProfile')
            reminderProfile.style.display = 'block'
        }
    })
}

controller.leaveThisConversation = async function(user, id) {
    if(model.currentConversation) {
        view.setText('leave-conversation-error', '')
        view.disable('leaveThisConversation')
        try {
            await firebase
            .firestore()
            .collection('conversations')
            .doc(id)
            .update({
                users: firebase.firestore.FieldValue.arrayRemove(user)
            })
        } catch(error) {
            view.setText('leave-conversation-error', error.message)
        }
    }
    view.enable('leaveThisConversation')
}

function isCurrentConversation(conversation) {
    return conversation
    && model.currentConversation 
    && model.currentConversation == conversation.id
}
    // let t = await firebase
    // .firestore()
    // .collection('conversations')
    // .where('users', "array-contains", user)
    // .onSnapshot(leaveThisConversationOnSnapshot)

    // function leaveThisConversationOnSnapshot(snapshot) {
    //     let docChanges = snapshot.docChanges()
    //     for (let docChange of docChanges) {
    //         let conversation = docChange.doc.data()
    //         model.updateConversation(conversation)
    //     }
    //     view.showConversationsList()
    // } 




