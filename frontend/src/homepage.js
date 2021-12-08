// render home page after user log in
function renderHome(user_token, user_email, user_pw){
    // get parent element
    const parent = document.getElementById('parent');

    // clear page to append new node
    const form = document.getElementById('form');
    parent.removeChild(form);

    // create new page content
    const home = document.createElement('div');
    home.id = 'home';
    home.classList.add('home');

    parent.appendChild(home);

    // profile top left coner
    const profile = document.createElement('div');
    profile.classList.add('profile');
    const profile_icon = document.createElement('img');
    profile_icon.classList.add('profile-icon');
    profile_icon.id = 'profile-user-image'
    const profile_status = document.createElement('div');
    profile_status.classList.add('profile-status');
    const profile_name = document.createElement('div');
    profile_name.id = 'profile-user-name';
    profile_name.innerText = user_email;
    profile_name.classList.add('profile-status-name');
    const profile_uid = document.createElement('div');
    profile_uid.id = 'profile-user-id';
    profile_uid.classList.add('profile-status-name');
    profile_status.appendChild(profile_name);
    profile_status.appendChild(profile_uid);

    profile.appendChild(profile_icon);
    profile.appendChild(profile_status);
    profile.addEventListener('click', (event) => clickedOwnProfile(user_token,user_pw))
    home.appendChild(profile);

    // channels on left
    const left = document.createElement('div');
    left.classList.add('home-left-banner');
    
    const channels = document.createElement('div');
    channels.id='channels'
    channels.style.overflowY = 'auto';
    channels.style.maxHeight = '99%';
    channels.style.marginTop = '2%';
    left.appendChild(channels);

    // channel details on right
    const right = document.createElement('div');
    right.id = 'channel-content';
    right.classList.add('home-right-content');

    // top banner containing 

    const top_banner = document.createElement('div');
    top_banner.classList.add('channel-banner');

    const channel_name = document.createElement('label');
    channel_name.id='channel_name';
    channel_name.classList.add('channel-name')

    // $ leave channel
    const leave_channel = document.createElement('button');
    leave_channel.classList.add('btn');
    leave_channel.classList.add('leave-channel-btn');
    leave_channel.innerText = 'Leave';
    leave_channel.addEventListener('click', (event)=> popup('Are you sure you want to leave this channel?', 'leave',user_token));

    // $ invite users to channel
    const invite_user = document.createElement('button');
    invite_user.classList.add('btn');
    invite_user.classList.add('invite-to-channel-btn');
    invite_user.innerText = 'Invite';
    invite_user.addEventListener('click', (event) => clickedInviteChannel(user_token));
    
    // $ config
    const config_channel = document.createElement('button');
    config_channel.classList.add('btn');
    config_channel.classList.add('edit-channel-btn');
    config_channel.innerText = 'Setting'
    config_channel.addEventListener('click', (event) => clickedConfigChannel(user_token))

    // $ pinned msgs    
    const pinned_display = document.createElement('div');
    pinned_display.id = 'pinned-msgs'
    pinned_display.classList.add('channel-pinned_msgs')
    pinned_display.style.display = 'none'

    const pinned_channel = document.createElement('button');
    pinned_channel.classList.add('btn');
    pinned_channel.classList.add('pinned-channel-btn');
    pinned_channel.innerText = 'Pinned Message'
    pinned_channel.addEventListener('click',(event) => {
        if(pinned_display.style.display === 'none') pinned_display.style.display = 'block';
        else pinned_display.style.display = 'none'
    })

    pinned_channel.appendChild(pinned_display);

    const channel_messages = document.createElement('div');
    channel_messages.id = 'channel-messages';
    channel_messages.classList.add('channel-messages');

    const channel_members = document.createElement('div');
    channel_members.classList.add('channel-members');
    channel_members.id = 'channel-members';

    const channel_dialogs = document.createElement('div');
    channel_dialogs.id = 'channel-dialogs';
    channel_dialogs.classList.add('channel-dialogs');
    

    const message_input = document.createElement('textarea');
    message_input.id = 'msg_input';
    message_input.placeholder = 'Insert your message here';
    message_input.classList.add('channel-messages-input');
    message_input.autofocus = false;

    const operations = document.createElement('div');
    operations.classList.add('chat-operations');

    const send = document.createElement('button');
    send.innerText = 'Send';
    send.classList.add('send-msg');
    send.addEventListener('click', () => clickedSend(user_token))

    const attachment = document.createElement('input');
    attachment.type = 'file';
    attachment.accept ='image/*';
    attachment.id = 'image_input';
    attachment.innerText = 'Add Attachment';
    attachment.classList.add('add-image');


    
    channel_messages.appendChild(channel_dialogs)
    channel_messages.appendChild(channel_members);

    top_banner.appendChild(channel_name);
    top_banner.appendChild(config_channel);
    top_banner.appendChild(pinned_channel);
    top_banner.appendChild(invite_user);
    top_banner.appendChild(leave_channel);

    right.append(top_banner);
    right.append(channel_messages);
    right.append(message_input);
    right.appendChild(operations);

    operations.appendChild(attachment);
    operations.appendChild(send);

    home.appendChild(left);
    home.appendChild(right);

    // fetch channels data and display
    getUserID(user_token,user_email);
}





