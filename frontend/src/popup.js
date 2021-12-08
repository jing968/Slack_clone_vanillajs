// $msg -> msg to display on modal
// $user -> user token that identifies the user
// $usage -> type of alet error/success/ \/home /leave
// $user_email -> accout identifier 
function popup(msg, usage,user,user_email,user_pw){
    // get parent element
    var parent = document.getElementById('parent')
    
    // create new popup element
    var popup_container = document.createElement('div');
    popup_container.classList.add('popup-container')
    popup_container.id = 'popup';

    var banner = document.createElement('div');
    banner.innerText = 'System message';
    banner.classList.add('popup-banner')

    var content = document.createElement('div');
    content.innerText = msg;
    content.classList.add('popup-content');
    
    // change color and routing base on usage
    if(usage === '/home' || usage === 'success'){
        popup_container.style.border = '1px solid #23a6d5';
        banner.style.backgroundColor = '#23a6d5';
    }

    var button = document.createElement('button')
    button.innerText = 'OK !';
    button.classList.add('popup-button')
    button.addEventListener('click', (event) => {
        parent.removeChild(popup_container)
        if(usage === '/home')renderHome(user,user_email,user_pw);
        else if(usage === 'leave') clickedLeaveChannel(user);
    })


    popup_container.appendChild(banner);
    popup_container.appendChild(content);
    popup_container.appendChild(button);

    // add extra button to cancel operation if usage to leave a channel or join a channel
    if(usage === 'leave'){
        var cancel = document.createElement('button')
        button.innerText = 'YES';
        cancel.innerText = 'NO';
        cancel.classList.add('popup-button')
        cancel.addEventListener('click', (event) => {
            parent.removeChild(popup_container)
        })
        popup_container.appendChild(cancel);
        cancel.style.background = 'red';
    }else if(usage === 'join'){
        var join = document.createElement('button')
        button.innerText = 'No';
        join.innerText = 'Join !';
        join.classList.add('popup-button')
        join.addEventListener('click', (event) => {
            var channel_id = document.getElementById('active-channel').parentNode.id;
            clickedJoinChannel(user,channel_id);
            parent.removeChild(popup_container)
        })
        popup_container.appendChild(join);
        button.style.background = 'red';        
    }


    parent.appendChild(popup_container);
}
