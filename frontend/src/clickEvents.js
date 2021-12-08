/////////////////////////////////////////////////////////
// CLICK EVENTS ON LANDING SCREEN
// when user click on the landing page logo, prompt them to login or singup
function clickedContinue(){
    // get parent element
    var parent = document.getElementById('parent')

    // clear page to append new node
    var landing = document.getElementById('landing')
    parent.removeChild(landing)

    // create form and append to the page
    var form = document.createElement('div');
    form.id = 'form'
    form.classList.add('form')

    var heading = document.createElement('div');
    heading.innerText = 'Welcome to Slackr'
    heading.classList.add('form-heading');

    // choose form usage either login or signup
    var usage = document.createElement('div');
    usage.classList.add('form-usage')

    var login = document.createElement('div');
    login.innerText = 'Log-in'
    login.classList.add('form-usage-option')
    login.classList.add('form-chosen');
    login.id = "login"
    login.addEventListener('click', (event)=> clickedFormOption('login') )

    var signup = document.createElement('div');
    signup.innerText ='Sign-up'
    signup.classList.add('form-usage-option')
    signup.id= 'signup'
    signup.addEventListener('click', (event)=> clickedFormOption('signup') )

    usage.appendChild(login);
    usage.appendChild(signup);

    // Hidden name field only shown when sign-in option is selected
    var _name = document.createElement('label')
    _name.innerText ='Username'
    _name.id ='_username';
    var name = document.createElement('input');
    name.type ='text';
    name.id = 'username';
    name.classList.add('form-fields');
    _name.classList.add('form-titles');
    name.style.display = 'none';
    _name.style.display = 'none';
    
    // Other fields will always appear on the form
    var _username = document.createElement('label')
    _username.innerText ='Email'
    var username = document.createElement('input');
    username.type ='text';
    username.id = 'email'
    username.classList.add('form-fields');
    _username.classList.add('form-titles');

    var _password = document.createElement('label')
    _password.innerText ='Password'    
    var password = document.createElement('input');
    password.type= 'password';
    password.id = 'password';
    password.classList.add('form-fields');
    _password.classList.add('form-titles');

    // Different buttons will be shown based on usage selected
    var login_btn = document.createElement('button');
    login_btn.innerText = 'Login'
    login_btn.id = 'login-btn';
    login_btn.classList.add('form-btns');
    login_btn.addEventListener('click', (event) => clickedFormlogin());

    var signup_btn = document.createElement('button');
    signup_btn.innerText = 'Signup';
    signup_btn.id = 'signup-btn'
    signup_btn.classList.add('form-btns');
    signup_btn.addEventListener('click', (event) => clickedFormsingup());
    signup_btn.style.display = 'none';

    form.appendChild(heading);
    form.appendChild(usage);
    form.appendChild(_name);
    form.appendChild(name);
    form.appendChild(_username);
    form.appendChild(username);
    form.appendChild(_password);
    form.appendChild(password);
    form.appendChild(login_btn);
    form.appendChild(signup_btn);
    parent.appendChild(form);

}

//////////////////////////////////////////////////////////
// CLICK EVENTS ON FORMS
// when user switch between signup and login via clicking
function clickedFormOption(id){
    var login = document.getElementById('login');
    var signup = document.getElementById('signup');
    var name = document.getElementById('username');
    var _name = document.getElementById('_username');
    var login_btn = document.getElementById('login-btn');
    var signup_btn = document.getElementById('signup-btn');
    if(id === 'login'){
        login.classList.add('form-chosen');
        signup.classList.remove('form-chosen');
        name.style.display = 'none';
        _name.style.display = 'none';
        login_btn.style.display = 'block';
        signup_btn.style.display = 'none';
    }else{
        signup.classList.add('form-chosen');
        login.classList.remove('form-chosen'); 
        name.style.display = 'block';
        _name.style.display = 'block';   
        login_btn.style.display = 'none';
        signup_btn.style.display = 'block';

    }
}

// when user click on login botton 
function clickedFormlogin(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5005/auth/login');


    // don't know why it's triggering 4 statechanges on every click
    /*
    xhr.onreadystatechange = function(event) {
        var res = JSON.parse(event.target.response)
        if(xhr.status === 200) console.log(res.token);
        else if(xhr.status === 400)console.log(res.error);
    }*/
   
    xhr.onload = function(event){
        var res = JSON.parse(event.target.response)
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            popup("Welcome back \n ",'/home',res.token,email,password);   
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup(res.error,'error')
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*")
    xhr.send(JSON.stringify({
        email: email,
        password: password
    }));  
}

// when user click on signup botton 
function clickedFormsingup(){
    var name = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5005/auth/register');
   
    xhr.onload = function(event){
        var res = JSON.parse(event.target.response)
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            popup("User successfully created",'/home',res.token,email);
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup(res.error,'error')
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*")
    xhr.send(JSON.stringify({
        email: email,
        password: password,
        name: name
    }));  
}

// when user switch between join and create channel
// I realised I can just put themm all in a div and modify display style all at once .... 
// BUT I ceebs refactoring please forgive me
function clickedFormOption_channel(id){
    var usage_create = document.getElementById('create-channel');
    var usage_join = document.getElementById('join-channel');
    var create_btn = document.getElementById('confirm_new');
    var join_btn = document.getElementById('confirm_join');
    var _name = document.getElementById('_new-channel-name');
    var name = document.getElementById('new-channel-name');
    var _description = document.getElementById('_new-channel-description');
    var description = document.getElementById('new-channel-description');
    var _visibility = document.getElementById('_new-channel-visibility');
    var visibility = document.getElementById('new-channel-visibility');
    var id_field = document.getElementById('join-id');
    var _id_field = document.getElementById('_join-id');
    if(id === 'create-channel'){
        usage_create.classList.add('form-chosen');
        usage_join.classList.remove('form-chosen');
        // hide
        join_btn.style.display = 'none';
        id_field.style.display ='none';
        _id_field.style.display ='none';
        // show
        create_btn.style.display = 'block'     
        _name.style.display = 'block';
        name.style.display = 'block';
        _description.style.display = 'block';
        description.style.display = 'block';
        _visibility.style.display = 'block';
        visibility.style.display = 'flex';
    }else{
        usage_create.classList.remove('form-chosen');
        usage_join.classList.add('form-chosen');
        // show
        join_btn.style.display = 'block';
        id_field.style.display ='block';
        _id_field.style.display ='block';
        // hide
        create_btn.style.display = 'none';     
        _name.style.display = 'none';
        name.style.display = 'none';
        _description.style.display = 'none';
        description.style.display = 'none';
        _visibility.style.display = 'none';
        visibility.style.display = 'none';
    }
}

// when user click on create channel button inside the form
function clickedCreateChannel(user_token, name, description, private){
    const xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5005/channel');

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response)
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            popup('Successfully created new channel', 'success');
            rerenderChannels(user_token);
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup(res.error,'')
            console.log(res.error);
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup(res.error,'')
            console.log(res.error);
        }
        var parent = document.getElementById('parent');
        var form = document.getElementById('form');
        parent.removeChild(form);
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(JSON.stringify({
        name: name,
        private: private,
        description: description
    }));  
}

// when user click on join channel button inside the form
function clickedJoinChannel(user_token, id){
    const xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5005/channel/'+ id + '/join');

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response)
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            popup("Welcome to new channel",'success');   
            rerenderChannels(user_token)
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup("The channel your are looking for does not exist",'')
            console.log(res.error);
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup("Ops the channel you are looking for is a private channel, \n get the channel members to invite you !",'')
            console.log(res.error);
        }
        var parent = document.getElementById('parent');
        var form = document.getElementById('form');
        if(parent !== null && form !== null)parent.removeChild(form);
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.setRequestHeader('channelId',id);
    xhr.send();  
}

/////////////////////////////////////////////////////////
// CLICK EVENTS ON HOME SCREEN AFTER LOGGING IN
// when user click on create channel
function clickedNewChannel(user_token){
    // get parent element
    var parent = document.getElementById('parent')

    // create form and append to the page
    var form = document.createElement('div');
    form.id = 'form'
    form.classList.add('form')

    var heading = document.createElement('div');
    heading.innerText = 'Add new channels'
    heading.classList.add('form-heading');

    // choose form usage either login or signup
    var usage = document.createElement('div');
    usage.classList.add('form-usage')

    var join = document.createElement('div');
    join.innerText = 'Join a channel';
    join.classList.add('form-usage-option');
    join.id = "join-channel";
    join.addEventListener('click', (event)=> clickedFormOption_channel('join-channel') );

    var create = document.createElement('div');
    create.innerText ='Create your own channel'
    create.classList.add('form-usage-option')
    create.classList.add('form-chosen');
    create.id= 'create-channel';
    create.addEventListener('click', (event)=> clickedFormOption_channel('create-channel') );

    usage.appendChild(create);
    usage.appendChild(join);


    // hide on default
    var _id_field = document.createElement('label');
    _id_field.innerText ='Channel ID you wish to join';
    _id_field.id ='_join-id';
    var id_field = document.createElement('input');
    id_field.type ='text';
    id_field.id = 'join-id';
    id_field.classList.add('form-fields');
    _id_field.classList.add('form-titles');
    _id_field.style.display = 'none';
    id_field.style.display = 'none';

    // Shown on default
    // channel name field
    var _name = document.createElement('label');
    _name.innerText ='New Channel Name';
    _name.id ='_new-channel-name';
    var name = document.createElement('input');
    name.type ='text';
    name.id = 'new-channel-name';
    name.classList.add('form-fields');
    _name.classList.add('form-titles');

    // channel description field
    var _description = document.createElement('label');
    _description.innerText ='Channel Description';
    _description.id ='_new-channel-description';
    var description = document.createElement('input');
    description.type ='text';
    description.id = 'new-channel-description';
    description.classList.add('form-fields');
    _description.classList.add('form-titles');

    // channel vsibility field
    var _visibility = document.createElement('label');
    _visibility.innerText ='Hide channel from public?';
    _visibility.id ='_new-channel-visibility';
    _visibility.classList.add('form-titles');
    var visibility = document.createElement('div');
    visibility.id= 'new-channel-visibility';
    visibility.classList.add('form-raido-container');
    var vis_true = document.createElement('input');
    vis_true.type = 'radio';
    vis_true.name = 'visibility'
    vis_true.checked = true;
    var _vis_true = document.createElement('div');
    _vis_true.innerText = 'Yes';
    var vis_false = document.createElement('input');
    vis_false.type = 'radio';
    vis_false.name = 'visibility'
    var_vis_false = document.createElement('div');
    var_vis_false.innerText = 'No';

    visibility.appendChild(vis_true);
    visibility.appendChild(_vis_true);
    visibility.appendChild(vis_false);
    visibility.appendChild(var_vis_false);
    
    // buttons
    var confirm_new = document.createElement('button');
    confirm_new.id = 'confirm_new';
    confirm_new.innerText ='Create';
    confirm_new.classList.add('form-btns');
    confirm_new.addEventListener('click', (event)=> {
        var new_name = name.value;
        var new_description = description.value;
        var new_private;
        vis_true.checked ? new_private = true : new_private = false;
        clickedCreateChannel(user_token,new_name,new_description, new_private);

    })

    var confirm_join = document.createElement('button');
    confirm_join.id = 'confirm_join';
    confirm_join.innerText ='Join';
    confirm_join.classList.add('form-btns');
    confirm_join.style.display = 'none';
    confirm_join.style.marginBottom = '0px';
    confirm_join.addEventListener('click', (event)=> {
        var join_id = id_field.value;
        clickedJoinChannel(user_token, join_id);
    })
    
    var cancel = document.createElement('button')
    cancel.innerText = 'Cancel';
    cancel.classList.add('form-btns');
    cancel.style.backgroundColor = '#e73c7e';
    cancel.style.marginTop = '10px';
    cancel.style.marginBottom = '10px';
    cancel.addEventListener('click',(event)=>{
        parent.removeChild(form);
    })


    form.appendChild(heading);
    form.appendChild(usage);
    form.appendChild(_name);
    form.appendChild(name);
    form.appendChild(_description);
    form.appendChild(description);
    form.appendChild(_visibility);
    form.appendChild(visibility);
    form.appendChild(_id_field);
    form.appendChild(id_field);
    form.appendChild(confirm_join);
    form.appendChild(confirm_new);
    form.appendChild(cancel)

    parent.append(form);
}

// when user select a channel on the left banner
function clickedChannel(user_token,channel_id){
    // remove the previous highlight if any
    var prev_channel_pointer = document.getElementById('active-channel');
    if(prev_channel_pointer != null){
        prev_channel_pointer.parentElement.style.border = "1px none white";
        prev_channel_pointer.parentNode.removeChild(prev_channel_pointer);
       
    }
    // highlight the selected channel to notify user
    var cur_channel = document.getElementById(channel_id);
    cur_channel.style.border = "5.5px solid rgb(237, 240, 61)"
    var cur_channel_pointer = document.createElement('div');
    cur_channel_pointer.id = 'active-channel';
    cur_channel.prepend(cur_channel_pointer);



    const xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:5005/channel/'+channel_id);

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            var channel_name= document.getElementById('channel_name');
            channel_name.innerText = res.name;
            // clear info from previous channel
            var prev_mem = document.getElementById('channel-members');
            while (prev_mem.firstChild) { prev_mem.removeChild(prev_mem.firstChild);}
            var prev_chat = document.getElementById('channel-dialogs');
            while (prev_chat.firstChild) { prev_chat.removeChild(prev_chat.firstChild);}

            (res.members).map((member)=>{
                populateChannelMembers(user_token, member, 'member')
            })
            populateMessages(user_token,channel_id,0);
            

        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('This channel does not exists', '');
            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You are not a member of this channel, do you want to join this channel?', 'join',user_token);
        }
      
        
        
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(); 


}

// when user click on configuring channel
function clickedConfigChannel(user_token){
    var cur_channel = document.getElementById('active-channel');
    var parent = document.getElementById('parent')

    var form = document.createElement('div');
    form.id = 'form'
    form.classList.add('form')
    form.style.paddingBottom ='20px';

    var heading = document.createElement('div');
    heading.innerText = 'Channel details'
    heading.classList.add('form-heading');

    // channel id field
    var _id_field = document.createElement('label');
    _id_field.innerText ='Channel ID : ' + cur_channel.parentNode.id;
    _id_field.classList.add('form-titles');

    // channel creator & channel time
    var creator = document.createElement('div');
    creator.id = 'updateChannelform';
    creator.innerText ='Channel Owner : ';
    creator.classList.add('form-titles');
    creator.style.display ='flex';
    creator.style.flexDirection ='row'
    var createdAT = document.createElement('label')
    createdAT.classList.add('form-titles');

    // channel name field
    var _name = document.createElement('label');
    _name.innerText ='Channel Name';
    _name.id ='_new-channel-name';
    var name = document.createElement('input');
    name.type ='text';
    name.id = 'new-channel-name';
    name.classList.add('form-fields');
    _name.classList.add('form-titles');

    // channel description field
    var _description = document.createElement('label');
    _description.innerText ='Channel Description';
    _description.id ='_new-channel-description';
    var description = document.createElement('input');
    description.type ='text';
    description.id = 'new-channel-description';
    description.classList.add('form-fields');
    _description.classList.add('form-titles');

    // channel vsibility field
    var _visibility = document.createElement('label');
    _visibility.classList.add('form-titles');

    // buttons
    var confirm_btn = document.createElement('button');
    confirm_btn.innerText ='Update';
    confirm_btn.classList.add('form-btns');
    confirm_btn.style.marginBottom = '0px';
    confirm_btn.addEventListener('click', (event)=> {
        clickedUpdateChannel(user_token, cur_channel.parentNode.id, name.value, description.value)
    })
    confirm_btn.disabled = true;
    confirm_btn.classList.add('form-btns-disabled');


    
    var cancel = document.createElement('button')
    cancel.innerText = 'Cancel';
    cancel.classList.add('form-btns');
    cancel.style.backgroundColor = '#e73c7e';
    cancel.style.marginTop = '10px';
    cancel.style.marginBottom = '10px';
    cancel.addEventListener('click',(event)=>{
        parent.removeChild(form);
    })


    form.appendChild(heading);
    form.appendChild(_id_field);
    form.appendChild(creator);
    form.appendChild(createdAT);
    form.appendChild(_name);
    form.appendChild(name);
    form.appendChild(_description);
    form.appendChild(description);
    form.appendChild(_visibility);
    form.appendChild(confirm_btn);
    form.appendChild(cancel)

    parent.append(form);

    // fetching channel details to fill the form
    const xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:5005/channel/'+cur_channel.parentNode.id);

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            populateChannelMembers(user_token, res.creator, 'updateChannel')
            createdAT.innerText =  'Created at ' + res.createdAt.substring(0, 10);
            res.private ? _visibility.innerText = 'This is a private channel' : _visibility.innerText = 'This is a public channel';
            name.value = res.name;
            description.value = res.description;
            // only enable update method if and only if name or description is changed
            name.onchange=((event) => {
                if(description.value !== res.description || name.value !== res.name) {
                    confirm_btn.disabled = false;
                    confirm_btn.classList.remove('form-btns-disabled');
                }else{
                    confirm_btn.disabled = true;
                    confirm_btn.classList.add('form-btns-disabled');
                }
            })
            description.onchange=((event) => {
                if(description.value !== res.description || name.value !== res.name) {
                    confirm_btn.disabled = false;
                    confirm_btn.classList.remove('form-btns-disabled');
                }else{
                    confirm_btn.disabled = true;
                    confirm_btn.classList.add('form-btns-disabled');
                }
            })



        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('This channel does not exists', '');
            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You are not a member of this channel', '');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(); 
}

// when user click on update chanell details button
function clickedUpdateChannel(user_token, channel_id, name, description){

    const xhr = new XMLHttpRequest();
    xhr.open('PUT','http://localhost:5005/channel/'+channel_id);

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            popup('Updated successfully!');
            var form = document.getElementById('form');
            form.parentNode.removeChild(form);
            channel_name.innerText = name;
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('Bad request', '');
            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You do not have permissions to update this channel', '');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(JSON.stringify({
        name: name,
        description: description
    })); 
}

// when user click on leave channel button
function clickedLeaveChannel(user_token){
    const xhr = new XMLHttpRequest();
    var cur_channel = document.getElementById('active-channel');
    var channel_id = cur_channel.parentNode.id;

    xhr.open('POST','http://localhost:5005/channel/'+channel_id + '/leave');

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            popup('You have left the channel with ID - ' + channel_id, 'success');
            rerenderChannels(user_token);
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('The channel you are trying to leave does not exists', '');
            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You are not a member of this channel', '');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send();     
}

// when user click on invite button
function clickedInviteChannel(user_token){
    var parent = document.getElementById('parent')

    var form = document.createElement('div');
    form.id = 'form'
    form.classList.add('form')
    form.style.paddingBottom ='20px';

    var heading = document.createElement('div');
    heading.innerText = 'Invite users to this channel';
    heading.classList.add('form-heading');


    var user_container = document.createElement('div');
    user_container.id = 'invite-options';
    user_container.classList.add('invite_user_container');


    // buttons
    var confirm_btn = document.createElement('button');
    confirm_btn.innerText ='Invite';
    confirm_btn.classList.add('form-btns');
    confirm_btn.style.marginBottom = '0px';
    confirm_btn.addEventListener('click', (event)=> {
        var users = document.getElementsByClassName('selected-user');
        for(var i = 0; i < users.length; i ++){
            console.log(users[i].id);
            clickedInvite(user_token,users[i].id);
        };
            

        parent.removeChild(form);
    })

    
    var cancel = document.createElement('button')
    cancel.innerText = 'Cancel';
    cancel.classList.add('form-btns');
    cancel.style.backgroundColor = '#e73c7e';
    cancel.style.marginTop = '10px';
    cancel.style.marginBottom = '10px';
    cancel.addEventListener('click',(event)=>{
        parent.removeChild(form);
    })

    form.appendChild(heading);
    form.appendChild(user_container);
    form.appendChild(confirm_btn);
    form.appendChild(cancel)

    parent.appendChild(form);

    const xhr = new XMLHttpRequest();
    var user_id =parseInt(document.getElementById('profile-user-id').innerText.substring(4));
    xhr.open('GET','http://localhost:5005/user/');

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            res.users.map((cur_user) => {
                populateChannelMembers(user_token,cur_user.id, 'invite');
            });
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('Bad request', '');
            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You are a hacker please relog', '');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send();    
    
}

// when user click on invite button on invitation form
function clickedInvite(user_token,invite){
    const xhr = new XMLHttpRequest();
    var cur_channel = document.getElementById('active-channel');
    var channel_id = cur_channel.parentNode.id;

    xhr.open('POST','http://localhost:5005/channel/'+channel_id + '/invite');

    xhr.onload = function(event){

        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            popup('You have invited the user with ID - ' + invite + ' to this channel', 'success');
            clickedChannel(user_token,channel_id)
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('The user you are trying to invite does not exists', '');
            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You are not a member of this channel', '');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(JSON.stringify({userId: parseInt(invite)}));      
}

// when user click on own profile icon to edit
function clickedOwnProfile(user_token,user_pw){
    var parent = document.getElementById('parent');

    // create form and append to the page
    var form = document.createElement('div');
    form.id = 'form'; 
    form.classList.add('form');
    form.style.height = '750px';
    

    var heading = document.createElement('div');
    heading.innerText = 'User Profile'
    heading.classList.add('form-heading');


    var icon = document.createElement('img');
    icon.src = ("src/assets/profile.png");
    icon.classList.add('form-profile-icon');

    var change_icon = document.createElement('input');
    change_icon.type = 'file';
    change_icon.accept ='image/*';
    change_icon.classList.add('form-fields');
    
    var _name = document.createElement('label')
    _name.classList.add('form-titles');
    _name.innerText = 'Username'
    var name = document.createElement('input');
    name.classList.add('form-fields');
    name.type ='text';

    var _bio = document.createElement('label')
    _bio.classList.add('form-titles');
    _bio.innerText = 'User Bio'
    var bio = document.createElement('input');
    bio.classList.add('form-fields');
    bio.type ='text';

    var _email = document.createElement('label')
    _email.classList.add('form-titles');
    _email.innerText = 'Email address'
    var email = document.createElement('input');
    email.classList.add('form-fields');
    email.type ='text';

    var _pw = document.createElement('label')
    _pw.classList.add('form-titles');
    _pw.innerText = 'Password'
    var pw = document.createElement('input');
    pw.classList.add('form-fields');
    pw.type = 'password';
    pw.value = user_pw;
    
    var btns = document.createElement('div');
    btns.style.padding ='10px';
    btns.style.display = 'flex';
    btns.style.flexDirection = 'row';
    btns.style.columnGap ='10px';

    var togglepw = document.createElement('button');
    togglepw.innerText = 'Show password';
    togglepw.classList.add('form-btns');
    togglepw.style.background = 'yellow';
    togglepw.style.color = 'green';
    togglepw.addEventListener('click', (event)=>{
        if(togglepw.innerText === 'Show password'){
            togglepw.innerText ='Hide password';
            pw.type = 'text';
        }else{
            togglepw.innerText = 'Show password';
            pw.type = 'password';
        }
    })

    var update = document.createElement('button');
    update.innerText = 'Update';
    update.classList.add('form-btns');
    update.addEventListener('click',(event)=>{
        if(change_icon.value !== ''){
            const file = document.querySelector('input[type="file"]').files[0];
            fileToDataUrl(file).then((image)=>{
                clickedUpdateOwnProfile(user_token,email.value,pw.value,name.value,bio.value,image)
            }).catch((err) => { })            
        }else{
            clickedUpdateOwnProfile(user_token,email.value,pw.value,name.value,bio.value,icon.src)
        }

        
    })

    var cancel = document.createElement('button');
    cancel.classList.add('form-btns');
    cancel.innerText = 'Cancel';
    cancel.addEventListener('click', (event) => {
        parent.removeChild(form);
    })
    cancel.style.background = 'red';

    var logout = document.createElement('button');
    logout.classList.add('form-btns');
    logout.innerText = 'Logout';
    logout.style.marginBottom ='5px';
    logout.addEventListener('click', (event) => clickedLogout(user_token) )


    form.appendChild(heading);
    form.appendChild(icon);
    form.appendChild(change_icon);
    form.appendChild(_name);
    form.appendChild(name);
    form.appendChild(_bio);
    form.appendChild(bio);
    form.appendChild(_email);
    form.appendChild(email);
    form.appendChild(_pw);
    form.appendChild(pw);
    form.appendChild(btns);
    btns.appendChild(togglepw);
    btns.appendChild(update);
    btns.appendChild(cancel);
    form.append(logout);

    parent.appendChild(form);


    // fetch user to fill the form
    const xhr = new XMLHttpRequest();
    var user_id =parseInt(document.getElementById('profile-user-id').innerText.substring(4));
    xhr.open('GET','http://localhost:5005/user/'+ user_id);

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        console.log(res);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            var dp = document.getElementById('profile-user-image');
            if(res.image !== null | res.image !== ''){
                dp.src = res.image;
            
            }   
            name.value = res.name;
            email.value = res.email;
            if(res.bio !== null)bio.value = res.bio;
           
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('Bad request', '');
            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You are a hacker please relog', '');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send();   
}

// when user click on update button on the user profile form
function clickedUpdateOwnProfile(user_token,email,pw,name,bio,image){
    const xhr = new XMLHttpRequest();
    xhr.open('PUT','http://localhost:5005/user/');
    console.log('' + email);
    console.log(email);
    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            popup('Your profile details is successfully updated', 'success');
            var parent = document.getElementById('parent')
            var form = document.getElementById('form');
            parent.removeChild(form);
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('Invalid Input', '');
            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You are a hacker please relog', '');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(JSON.stringify({
        email: email,
        password: '' +pw,  
        name: name,
        bio: bio,
        image: image
    }));      
}

// when user click on other users icon to trigger profile
function clickedUserProfile(id,email,name,bio,image){
    var parent = document.getElementById('parent');

    // create form and append to the page
    var form = document.createElement('div');
    form.id = 'form'; 
    form.classList.add('form');
    

    var heading = document.createElement('div');
    heading.innerText = 'User Profile'
    heading.classList.add('form-heading');


    var icon = document.createElement('img');
    if(image === null | '') icon.src = ("src/assets/profile.png");
    else icon.src = image;
    icon.classList.add('form-profile-icon');

    var _id = document.createElement('label');
    _id.classList.add('form-titles');
    _id.innerText = 'User ID: ' + id

    var _name = document.createElement('label')
    _name.classList.add('form-titles');
    _name.innerText = 'Username: ' + name;


    var _bio = document.createElement('label')
    _bio.classList.add('form-titles');
    _bio.innerText = 'User Bio: ' + bio;

    var _email = document.createElement('label')
    _email.classList.add('form-titles');
    _email.innerText = 'Email address:' + email;
    
    var cancel = document.createElement('button');
    cancel.classList.add('form-btns');
    cancel.innerText = 'OK';
    cancel.addEventListener('click', (event) => {
        parent.removeChild(form);
    })

    form.appendChild(heading);
    form.appendChild(icon);
    form.appendChild(_id);
    form.appendChild(_name);
    form.appendChild(_bio);
    form.appendChild(_email);
    form.appendChild(cancel);
    parent.appendChild(form);
}

// when user click on logout
function clickedLogout(user_token){
    const xhr = new XMLHttpRequest();
    xhr.open('POST','http://localhost:5005/auth/logout');

    xhr.onload = function(event){
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            popup('See you next time!', 'success');           
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You are a hacker please relog', '');
        }
        window.location.href = "index.html";
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send();       
}

// when user click to pin a message
function clickedPin(){

}


// when user click to unpin a message
function clickedunPin(){
}

// when user click on react
function clickedReact(message_id, user_token, react){
    const xhr = new XMLHttpRequest();
    var cur_channel = document.getElementById('active-channel');
    var channel_id = cur_channel.parentNode.id;
    xhr.open('POST','http://localhost:5005/message/react/'+ channel_id + '/' + message_id);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(JSON.stringify({react: react}));     
}

// when user click on unreact
function clickedUnreact(message_id, user_token, react){
    const xhr = new XMLHttpRequest();
    var cur_channel = document.getElementById('active-channel');
    var channel_id = cur_channel.parentNode.id;
    xhr.open('POST','http://localhost:5005/message/unreact/'+ channel_id + '/' + message_id);

    xhr.onload = function(event){ console.log(event.target.response)}
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(JSON.stringify({react: react}));     
}

// when user click send mesg
function clickedSend(user_token){
    var msg = document.getElementById('msg_input').value;
    document.getElementById('msg_input').value = '';

    var image = document.getElementById('image_input').value;
    document.getElementById('image_input').value = '';

    const xhr = new XMLHttpRequest();
    var cur_channel = document.getElementById('active-channel');
    var channel_id = cur_channel.parentNode.id;
    xhr.open('POST','http://localhost:5005/message/'+ channel_id );

    xhr.onload = function(event){rerenderMessages(user_token) }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    //
    if(image === '')xhr.send(JSON.stringify({message: msg})); 
    else{
        const file = document.querySelector('input[type="file"]');
        fileToDataUrl(file.files[0]).then((encoded)=>{
            xhr.send(JSON.stringify({message: msg, image: encoded})); 
        }).catch((err) => { })   
    }
}


// when user click remove msg
function clickedRemove(user_token,msg_id){
    var cur_channel = document.getElementById('active-channel');
    var channel_id = cur_channel.parentNode.id;

    const xhr = new XMLHttpRequest();
    var channel_id = cur_channel.parentNode.id;
    xhr.open('DELETE','http://localhost:5005/message/'+ channel_id + '/' + msg_id);

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            rerenderMessages(user_token);
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('You don\' have permissions to delete this message', '');
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('Error occured when we tried authenticate you', '');
        }
        
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send();
   
}


// when user click on edit button on message
function clickedEditMsg(user_token,msg_obj){
    // get parent element
    var parent = document.getElementById('parent')

    // create form and append to the page
    var form = document.createElement('div');
    form.id = 'form'
    form.classList.add('form')

    var heading = document.createElement('div');
    heading.innerText = 'Edit message'
    heading.classList.add('form-heading');

    var _content = document.createElement('label');
    _content.innerText = 'Message content';
    _content.classList.add('form-titles')

    var content = document.createElement('textarea');
    content.classList.add('form-fields');
    content.innerText = msg_obj.message;
    content.style.width = '80%';
    content.style.height = '50%';


    var edit = document.createElement('button');
    edit.innerText = 'Confirm'
    edit.classList.add('form-btns');
    edit.addEventListener('click', ()=>{
        clikcedEditBtn(user_token,msg_obj.id,content.value);
        parent.removeChild(form);
    })

    var cancel = document.createElement('button');
    cancel.innerText = 'Cancel';
    cancel.classList.add('form-btns');
    cancel.addEventListener('click', () => {
        parent.removeChild(form);
    })

    form.appendChild(heading);
    form.appendChild(_content);
    form.appendChild(content);
    form.appendChild(edit);
    form.appendChild(cancel);

    parent.appendChild(form);
}

// when user click edit button on edit msg dialog box
function clikcedEditBtn(user_token,msg_id,msg){

    const xhr = new XMLHttpRequest();
    var cur_channel = document.getElementById('active-channel');
    var channel_id = cur_channel.parentNode.id;
    xhr.open('PUT','http://localhost:5005/message/'+ channel_id + '/' + msg_id);

    xhr.onload = function(event){rerenderMessages(user_token) }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(JSON.stringify({message: msg})); 


}