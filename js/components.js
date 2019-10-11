const components = {};

components.register = `
<div class="register-page-grid">
    <section>
        <img src="./img/register-background.jpg" width="100%">
    </section>
    <section class="register-container">
        <form id="register-form" class="register-form">
            <div class="form-header">
                <p class="register-title montserrat-font">MindX Chat</p>
            </div>

            <div class="form-content">
                <div class="name-wrapper">
                    <div class="name-input-wrapper">
                        <input type="text" name="firstname" placeholder="First name">
                        <div id="firstname-error" class="error-message"></div>
                    </div>

                    <div class="name-input-wrapper">
                        <input type="text" name="lastname" placeholder="Last name" style="display:flex; float:right">
                        <div id="lastname-error" class="error-message"></div>
                    </div>
                </div>

                <div class="input-wrapper">
                    <input type="email" name="email" placeholder="Email">
                    <div id="email-error" class="error-message"></div>
                </div>

                <div class="input-wrapper">
                    <input type="password" name="password" placeholder="Password">
                    <div id="password-error" class="error-message"></div>
                </div>

                <div class="input-wrapper">
                    <input type="password" name="confirmPassword" placeholder="Confirm password">
                    <div id="confirmPassword-error" class="error-message"></div>
                </div>
            </div>
            <div id="register-error" class="message-error"></div>
            <div id="register-success" class="message-success"></div>
            <div class="form-footer">
                <a id="register-link" href="#login-form" class="already-have-an-acount">Already have an account? Login</a>
                <button type="submit" id="buttonSubmitRegister" class="buttonSubmit montserrat-font">Register</button>
            </div>
        </form>
    </section>
</div>
`

components.logIn = `
<section class="login-container">
    <div></div>
    <form id="login-form" class="login-form">
    <div class="form-header">
        <p class="register-title montserrat-font">Log In to MindX Chat</p>
    </div>
    <div class="input-wrapper">
        <input type="email" name="email" placeholder="Email">
        <div id="email-error" class="error-message"></div>
    </div>
    <div class="input-wrapper">
        <input type="password" name="password" placeholder="Password">
        <div id="password-error" class="error-message"></div>
    </div>
    <div id="login-error" class="message-error"></div>
    <div id="login-success" style="color: green" class="message-error"></div>
    <div class="form-footer">
        <a id="log-in-link" class="already-have-an-acount" style="cursor: pointer">Not have an account? Register</a>
        <button type="submit" id="buttonSubmitLogin" class="buttonSubmit montserrat-font">Log in</button>
    </div>
    </form>
    <div></div>
</section>
`

components.chat = `
<section class="chat-container">

      <div class="list-searchbar">
        
        <div id="conversations-list" class="conversations-list"></div>

        <div id="conversation-detail">
          <div class="title-conversation-detail">Conversation details:</div>
          <div id="email-chat" style="font-size: 12px"></div>
          <div id="date-chat"></div>
        </div>

        <div class="search">
          <form id="add-conversation-form">
            <div class="input-wrapper">
              <input id="form-add-input-title" type="text" name="title" placeholder="  conversation's name" maxlength="28" autocomplete="off"/>
              <div id="title-error" class="message-error"></div>
            </div>

            <div class="input-wrapper">
              <input id="form-add-input-email" type="email" name="friendEmail" placeholder="  input email here!" autocomplete="off"/>
              <div id="friend-email-error" class="message-error"></div>
            </div>

            <div class="button-wrapper">
              <button id="buttonAddSubmit" class="poppin-font" type="submit">Add</button>
            </div>
          </form>
        </div>

      </div>

      <div></div>
      <div class="current-conversation">
      <div class="partner-name-container poppin-font">
        <span id="partner-avatar" class="partner-avatar"></span>
        <span id="chat-name-display"></span>
      </div>
      <div id="message-container" class="message-container">
      </div>

        <form id="form-chat" class="form-chat">
          <div class="input-wrapper">
            <input type="text" id="form-chat-input" name="message" placeholder="Input something" autocomplete="off">
          </div>
          <div class="send-button-wrapper">
            <button type="submit" id="buttonSubmitSend" class="poppin-font">Send</button>
          </div>
        </form>
      </div>

    <div></div>
    <div class="profile-container">
      <div class="profile-container-avatar">
          <img src="./img/46504.jpg">
      </div>
      <div>
        <p id="user-display-name">Phuong Ta</p>
        <p id="gender-age"><span id="reminderProfile" style="color: red; display: none">Edit your profile now!</span>
        <span id="genderUser"></span><span id="ageUser"></span></p>
      </div> 
      <div>
          <button class="montserrat-font" id="buttonEditProfile" type="submit">Edit your profile</button>
      </div>
      <div>
        <button class="montserrat-font" id="buttonChatroom" type="submit">Chatroom</button>
      </div>
      <div>
        <button class="montserrat-font" id="leaveThisConversation" type="submit">Leave this conversation!</button>
        <div id="leave-conversation-error"></div>
      </div>
      <div>
        <button class="montserrat-font" id="buttonSubmitLogout" type="submit">Log out!</button>
      </div>
    </div>
    </section>
`

components.loading = `
<div class="loading-container">
    <img src="./img/loading.gif">
</div>
`

components.editProfile = `
<section>
      <div class="edit-profile-page">
        <div class="edit-profile">
          <div class="edit-profile-header montserrat-font">edit your<br>profile</div>
            <div class="header-bar"></div>

          <div class="edit-profile-box">
          <form id="edit-profile">
            <div>
              <label for="">first name</label>
              <input class="montserrat-font" type="text" name="editedFirstname" 
              id="editedFirstname" maxlength="12" autocomplete="off"/>
            </div>

            <div>
              <label for="">last name</label>
              <input class="montserrat-font" type="text" name="editedLastname" 
              id="editedLastname" maxlength="10" autocomplete="off"/>
            </div>

            <div>
              <label for="">year of birth</label>
              <input class="montserrat-font" type="number" name="editedYear"
              id="editedYear" min="1900" max="2008" maxlength="4" autocomplete="off"/>
            </div>

            <div>
              <label for="">gender</label>
              <select class="montserrat-font" name="editedGender" id="editedGender">
                <option name="female">Female</option>
                <option name="male">Male</option>
                <option>__</option>
              </select>
            </div>
            <div><button type="submit" class="montserrat-font">Done</button></div>
            <div id="editProfileMessage"></div>
          </form>
          </div>
        </div>

        <div></div>
        <div class="profile-container">
            <div class="profile-container-avatar">
                <img src="./img/46504.jpg">
            </div>
            <div>
              <p id="user-display-name">Phuong Ta</p>
              <p id="gender-age"><span id="reminderProfile" style="color: red; display: none">Edit your profile now!</span>
              <span id="genderUser"></span><span id="ageUser"></span></p>
            </div>
            <div>
                <button class="montserrat-font" id="buttonEditProfile" type="submit">Edit your profile</button>
            </div> 
            <div>
                <button class="montserrat-font" id="buttonChatroom" type="submit">Chatroom</button>
            </div>
            <div>
              <button class="montserrat-font" id="buttonSubmitLogout" type="submit">Log out!</button>
            </div>
        </div>
       </div>
    </section>
    `