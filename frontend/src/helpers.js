/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        popup('Error: provided file is not a png, jpg or jpeg image','');
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

// fetch and populate channels
function populateChannels(user_token){
    const xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:5005/channel');
   
    xhr.onload = function(event){
        var channels = document.getElementById('channels');
        var res = JSON.parse(event.target.response)
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            var user_id = document.getElementById('profile-user-id').innerText;
            (res.channels).map((channel) => {
                var {id, name, creator, private, members} = channel;
                var title = document.createElement('div');
                title.innerText = name.substring(0,3);
                title.classList.add('channel-profile-text');
                var cur = document.createElement('div');
                cur.classList.add('channel');
                cur.appendChild(title)
                cur.id = id;
                private ?  cur.classList.add('private-channel') :  cur.classList.add('public-channel');
                cur.addEventListener('click', (event)=> clickedChannel(user_token, id));
                if(private && members.includes(parseInt(user_id.substring(4)))){
                    channels.appendChild(cur);
                }else if(!private){
                    channels.appendChild(cur);
                }
                
            })

        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('Your a HACKER !','error')
            console.log(res.error);
        }
        // automatically clicks on the very first channel
        clickedChannel(user_token,channels.firstChild.id);
        // add options to create new channel anyways
        var new_channel = document.createElement('div');
        var title = document.createElement('div');
        title.classList.add('channel-profile-text');
        title.innerText = '+';
        title.style.color = 'grey'
        new_channel.classList.add('channel');
        new_channel.appendChild(title);
        new_channel.addEventListener('click', (event) => clickedNewChannel(user_token));
        channels.appendChild(new_channel);
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send();  
}

// render channel members
// usage used to deterine where to append user icon (msg_id/member)
function populateChannelMembers(user_token,user_id, usage){
    const xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:5005/user/'+user_id);

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            var parent;
            var cur_user = document.createElement('div');
            cur_user.classList.add('channel-member-card');
            var cur_icon = document.createElement('img');
            cur_icon.addEventListener('click',(event) => clickedUserProfile(user_id,res.email,res.name,res.bio,res.image))
            if(res.image === null){
                cur_icon.src = ("src/assets/profile.png")
            }else{
                cur_icon.src=res.image;;
            }
            cur_icon.classList.add('channel-member-card-logo')
            
            var cur_name = document.createElement('div');
            cur_name.innerText = res.name;
            
            cur_name.classList.add('channel-member-card-name')
            cur_user.appendChild(cur_icon);
            cur_user.appendChild(cur_name);
            // append to different places depends on usage
            if(usage === 'member'){
                parent = document.getElementById('channel-members');
            }else if(usage === 'updateChannel'){
                parent = document.getElementById('updateChannelform');
                cur_name.style.color = 'black';
            }else if(usage === 'invite'){
                parent = document.getElementById('invite-options');
                cur_name.style.color = 'black';
                cur_user.id = user_id;
                cur_user.addEventListener('click', (event) => {
                    if(cur_user.classList.contains('selected-user')){
                        cur_user.classList.remove('selected-user');
                    }else{
                        cur_user.classList.add('selected-user');
                    }
                })
            }else{
                parent = document.getElementById('channel-message-sender'+ usage);
            }
            parent.appendChild(cur_user);

            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('Ops something went wrong when fetching member info', '');
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('Your a hacker! You don\' belong to this channel', '');
        }
      
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(); 
}


// render channel messages
function populateMessages(user_token, channel_id, start){
    const xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:5005/message/'+ channel_id +'?start=' + start);
    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        console.log(res);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            res.messages.map((msg)=> {
                helper(user_token,msg)
            })

            // scroll to bottom
            var parent = document.getElementById('channel-dialogs');
            if(start === 0) parent.scrollBy(0,parent.scrollHeight);

            // add infinite scroll events if yet to fetch all msgs
            if(res.messages.length === 25){
                parent.addEventListener('scroll', (event)=> {
                    if(parent.scrollTop === 0){
                        var new_start = start + 25;
                        populateMessages(user_token, channel_id, new_start);
                    }
                })
            }


        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('Ops something went wrong when fetching messages', '');
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('Your a hacker! You don\' belong to this channel', '');
        }
      
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send(); 
}

// helper function to populate messages
function helper(user_token,msg_obj){
    // populate every msgs in main dialog box
    var parent = document.getElementById('channel-dialogs');

    var msg_container = document.createElement('div');
    msg_container.classList.add('channel-message-container');

    var msg_top = document.createElement('div');
    msg_top.classList.add('channel-message-top');

    var msg_sender = document.createElement('div');
    msg_sender.id = 'channel-message-sender'+ msg_obj.id;

    var msg_sentAt =document.createElement('div')
    msg_sentAt.classList.add('channel-message-sentAt');
    msg_sentAt.innerText = ' - ' + msg_obj.sentAt.substring(0, 10) + ' ' +  msg_obj.sentAt.substring(12, 19);
    if(msg_obj.edited) msg_sentAt.innerText += '(edited)'

    var msg_content = document.createElement('div');
    msg_content.classList.add('channel-message-content');
    msg_content.innerText = msg_obj.message
    

    msg_top.appendChild(msg_sender);
    msg_top.appendChild(msg_sentAt);
    msg_container.appendChild(msg_top);
    msg_container.appendChild(msg_content);

    parent.prepend(msg_container);

    populateChannelMembers(user_token,msg_obj.sender, msg_obj.id);
    var pin_icon = document.createElement('img');
    pin_icon.src = ("src/assets/pin.png");
    pin_icon.classList.add('reaction-trigger');
    msg_sentAt.appendChild(pin_icon);
    // populate image if the message contains an image
    //console.log('image' in msg_obj)
    if('image' in msg_obj){
        var image_container = document.createElement('img');
        image_container.src = msg_obj.image;
        msg_content.appendChild(image_container);
    }
    // populate pinned msgs into pinned display
    if(msg_obj.pinned){
        var pinned_display = document.getElementById('pinned-msgs');

        var pinned_container = document.createElement('div');
        pinned_container.style.borderBottom = "1px solid white"

        var pinned_sender = document.createElement('div');
        pinned_sender.innerText = msg_obj.sender;

        var pinned_content = document.createElement('div');
        pinned_content.innerText = msg_obj.message;

        pinned_container.appendChild(pinned_sender);
        pinned_container.appendChild(pinned_content);

        pinned_display.appendChild(pinned_container);
        pin_icon.classList.add('pinned-icon');
    }
    // reactions
    var reaction = document.createElement('img');
    reaction.src = ("src/assets/add_reaction.png");
    reaction.classList.add('reaction-trigger')
    
    var reaction_list = document.createElement('div');
    var up = document.createElement('div');
    up.classList.add('emotes');
    up.innerText = String.fromCodePoint(128077);
    var down = document.createElement('div');
    down.classList.add('emotes');
    down.innerText = String.fromCodePoint(128078);
    var heart = document.createElement('div');
    heart.classList.add('emotes');
    heart.innerText = String.fromCodePoint(129505);
    var clap = document.createElement('div');
    clap.classList.add('emotes');
    clap.innerText = String.fromCodePoint(128079);
    reaction_list.classList.add('reaction-options')
    reaction_list.style.display = 'none';
    reaction_list.appendChild(up);
    reaction_list.appendChild(down);
    reaction_list.appendChild(clap);
    reaction_list.appendChild(heart);
    msg_sentAt.appendChild(reaction_list);
    msg_sentAt.appendChild(reaction);
    reaction.addEventListener('click', (event)=>{
        if(reaction_list.style.display === 'none'){
            reaction_list.style.display = 'flex';
        }else{
            reaction_list.style.display = 'none';
        }
    })
    // adding event listener for each individual react option
    up.addEventListener('click', (event)=>{
        var r = document.createElement('div');
        r.classList.add('emotes');
        r.innerText = String.fromCodePoint(128077);
        msg_sentAt.appendChild(r);
        reaction_list.style.display = 'none';
        clickedReact(msg_obj.id, user_token, 'up');
        r.addEventListener('click', (event)=>{
            r.parentElement.removeChild(r);
            clickedUnreact(msg_obj.id, user_token, 'up');
        })
    });
    down.addEventListener('click', (event)=>{
        var r = document.createElement('div');
        r.classList.add('emotes');
        r.innerText = String.fromCodePoint(128078);
        msg_sentAt.appendChild(r);
        reaction_list.style.display = 'none';
        clickedReact(msg_obj.id, user_token, 'down');
        r.addEventListener('click', (event)=>{
            r.parentElement.removeChild(r);
            clickedUnreact(msg_obj.id, user_token, 'down');
        })
    });
    heart.addEventListener('click', (event)=>{
        var r = document.createElement('div');
        r.classList.add('emotes');
        r.innerText = String.fromCodePoint(129505);
        msg_sentAt.appendChild(r);
        reaction_list.style.display = 'none';
        clickedReact(msg_obj.id, user_token, 'heart');
        r.addEventListener('click', (event)=>{
            r.parentElement.removeChild(r);
            clickedUnreact(msg_obj.id, user_token, 'heart');
        })
    });
    clap.addEventListener('click', (event)=>{
        var r = document.createElement('div');
        r.classList.add('emotes');
        r.innerText = String.fromCodePoint(128079);
        msg_sentAt.appendChild(r);
        reaction_list.style.display = 'none';
        clickedReact(msg_obj.id, user_token, 'clap');
        r.addEventListener('click', (event)=>{
            r.parentElement.removeChild(r);
            clickedUnreact(msg_obj.id, user_token, 'clap');
        })
    });
    
    // populate any existing reactions
    if(msg_obj.reacts.length !== 0){
        msg_obj.reacts.map((each_react)=>{
            var temp = document.createElement('div');
            temp.classList.add('emotes');
            msg_sentAt.appendChild(temp);
            switch(each_react.react){
                case 'up':
                    temp.innerText = String.fromCodePoint(128077);
                    break;
                case 'down':
                    temp.innerText = String.fromCodePoint(128078);
                    break;
                case 'heart':
                    temp.innerText = String.fromCodePoint(129505);
                    break;
                case 'clap':
                    temp.innerText = String.fromCodePoint(128079);
                    break;
            }
            temp.addEventListener('click', (event)=>{
                console.log('here')
                temp.parentElement.removeChild(temp);
                clickedUnreact(msg_obj.id, user_token, each_react.react);
            })
            msg_sentAt.appendChild(temp);
        })
    }
    // more opertaions such as edit and delete
    var msg_operations = document.createElement('div');
    msg_operations.style.display = 'flex';
    msg_operations.style.flexDirection = 'row';

    // edit msg 
    var edit_btn = document.createElement('button');
    edit_btn.innerText = 'Edit';
    edit_btn.classList.add('remove-msg');
    edit_btn.addEventListener('click', () => {
        clickedEditMsg(user_token,msg_obj);
    })

    // add button for users to remove the message
    var delete_btn = document.createElement('button');
    delete_btn.innerText = 'X';
    delete_btn.classList.add('remove-msg');
    delete_btn.style.marginLeft = '5px';
    delete_btn.addEventListener('click', ()=>{
        clickedRemove(user_token,msg_obj.id);
    })


    msg_operations.appendChild(edit_btn);
    msg_operations.appendChild(delete_btn);
    msg_container.appendChild(msg_operations);

}

// re-render channels 
// typically called after joining/creating/leaving a channel
function rerenderChannels(user_token){
    var parent = document.getElementById('channels');
    while(parent.firstChild)parent.removeChild(parent.firstChild);
    
    populateChannels(user_token);
}

// render user id to profile
function getUserID(user_token, username){
    const xhr = new XMLHttpRequest();
    var id_node = document.getElementById('profile-user-id');
    xhr.open('GET','http://localhost:5005/user');

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            res.users.map((user)=>{
                if(user.email === username) {
                    id_node.innerText = 'ID: ' + user.id;
                }
            })
            populateChannels(user_token);
            getUserDP(user_token)
        }else if(xhr.readyState === xhr.DONE && xhr.status === 400){
            popup('Bad request', '');
            
        }else if(xhr.readyState === xhr.DONE && xhr.status === 403){
            popup('You are not a member of this channel', '');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader('Authorization',user_token);
    xhr.send();     
}

// render user profile picture
function getUserDP(user_token){
    const xhr = new XMLHttpRequest();
    var user_id =parseInt(document.getElementById('profile-user-id').innerText.substring(4));
    xhr.open('GET','http://localhost:5005/user/'+ user_id);

    xhr.onload = function(event){
        var res = JSON.parse(event.target.response);
        if(xhr.readyState === xhr.DONE && xhr.status === 200){
            var dp = document.getElementById('profile-user-image');
            if(res.image === null){
                dp.src = ("src/assets/profile.png");
            }else{
                dp.src = res.image;
            }
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

// re-render messages
// typically called after editing/sending messsage
function rerenderMessages(user_token){
    var parent = document.getElementById('channel-dialogs');
    while(parent.firstChild)parent.removeChild(parent.firstChild);
    var channel_id = document.getElementById('active-channel').parentNode.id;

    populateMessages(user_token,channel_id,0);

}

// re-render channel members
// typically called after invited new members into channel
function rerenderMembers(user_token){
    
}