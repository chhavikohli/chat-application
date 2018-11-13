let alluser = [];
let currentUser = {};
let targetUser = {};
const socket = io.connect();
let participants = [];
let groupUser = [],
smiliesMap = {
    ":)" : "1",
    ":(" : "2",
    ";)" : "3",
    ":d" : "4",
    ";;)": "5",
    ":/" : "7",
    ":x" : "8",
    ":p" : "10",
    ":*" : "11",
    ":o" : "13",
    ":>" : "15",
    ":s" : "17",
    ":((": "20",
    ":))": "21",
    ":|": "22",
    ":b": "26",
    ":&": "31",
    ":$": "32",
    ":?" : "39",
    "#o": "40",
    ":ss": "42",
    "@)": "43",
    ":w": "45",
    ":c": "101",
    ":h": "103",
    ":t": "104",
    ":q": "112"
},
smileyReg = /[:;#@]{1,2}[\)\/\(\&\$\>\|xXbBcCdDpPoOhHsStTqQwW*?]{1,2}/g;
/**
 *
 * @param data
 */
const httpCalls = (data = {}, callback) => {
    const info = Object.assign({}, data, {
        success: callback
    });
    $.ajax(info);
};
/**
 * function to authenticate user
 * info={success ,user ,token}
 */
function currentUserAuthenticate() {
    const username = $('#login-username').val();
    if (!username) {
        $('.outerBoundary p').html(`Please enter username!!!`);
        return;
    }
    let data = JSON.stringify({
        username,
    });
    httpCalls({
        method: 'POST',
        url: '/login',
        data,
        headers: {
            "content-type": "application/json",
        }
    }, (info) => {
        if (info.success === true) {
            socket.emit('login', info.user);
            currentUser = info.user;
            sessionStorage.setItem('Authorization', info.token);
            sessionStorage.setItem('username', username);
            keyAuthenticate();
        } else {
            $('.outerBoundary p').html(`Unauthorized user!!!`);

        }
    })
};

/**
 * function to authenticate user
 *
 */
function keyAuthenticate() {
    const token = sessionStorage.getItem('Authorization');
    httpCalls({
        method: 'POST',
        url: '/chats',
        headers: {
            "content-type": "application/json",
            'Authorization': token
        }
    }, (info) => {

        if (info) {

            $('.outerBoundary').fadeOut();
            $('.home').fadeIn();
        } else {
            $('.outerBoundary p').html(`Unauthorized user!!!`);

        }
    })
};
/**
 * function to load
 * all groups
 * online users
 * offline users
 * @param data
 */
const onPageLoad = (data) => {
    getAllGroups();
    let userData = $('ul.list');
    let user = $('.chat-container .sub-list');
    let currentUsr = $('.currentUser-container .sub-list');
    httpCalls({
        method: 'GET',
        url: '/users/data',

    }, (result) => {
        let x = 0;
        $.each(result.data, (i, item) => {

            groupUser.push({ id: item._id, picture: item.picture });
            if (item.username !== currentUser.username && x === 0) {
                alluser.push(item);
                x++;
            }
        });
        currentUsr.html(`<li class="sub-list" >
            <img src="./assets/${currentUser.picture}" alt="avatar" />
            <div class="sub-list-data">
            <div class="name">${currentUser.name}</div>
            </div>
            </li>`);
        user.html(`<li class="sub-list" >
            <img src="./assets/${alluser[0].picture}" alt="avatar" />
            <div class="sub-list-data">
            <div class="name">${alluser[0].name}</div>
            <div class="status">${alluser[0].status}</div>

            </div>
            </li>`);
        targetUser = {
            id: alluser[0]._id,
            name: alluser[0].name,
            username: alluser[0].username,
            picture: alluser[0].picture,
            role: 0
        };

        /*----------------------------------------display all online users---------------------------------------------------------------------------------------*/
        $.each(data, (i, item) => {

            if (item.username !== currentUser.username) {
                userData.append(`<li class="sub-list"  attr-user-id="${item._id}" attr-user-role=0  attr-user-name="${item.name}" attr-user-userName="${item.username}" attr-user-picture="${item.picture}" >
                    <img src="./assets/${item.picture}" alt="avatar" /> <span class="dot"></span>
                    <div class="sub-list-data">             
                    <div class="name">${item.name}</div>
                     <div class="status">${item.status}</div>
               
                    </div>
                    </li>`);
            }
        });
        /*----------------------------------------display all offline users---------------------------------------------------------------------------------------*/
        let onlineUser = false;
        $.each(result.data, (i, item) => {
            onlineUser = false;
            $.each(data, (i, onlineUsers) => {
                if (item._id === onlineUsers._id) {
                    onlineUser = true;
                }
            });

            if (onlineUser === false && item.username !== currentUser.username) {
                userData.append(`<li class="sub-list"  attr-user-id="${item._id}" attr-user-role=0 attr-user-name="${item.name}" attr-user-userName="${item.username}" attr-user-picture="${item.picture}" >
                    <img src="./assets/${item.picture}" alt="avatar" /> <!--<span class="dot"></span>-->
                    <div class="sub-list-data">             
                    <div class="name">${item.name}</div>
                     <div class="status">${item.status}</div>
               
                    </div>
                    </li>`);
            }

        });
        getAllChats();
        renderSmilies();
    })
};
function renderSmilies() {
    var $smileyGrid = $(".smiley-grid");

    // render smilies if required
    if($smileyGrid.children().length == 0) {
        var smileisPerRow = 6,
            $smileySet = $(),
            $smileyRow = $();

        for(var i in smiliesMap) {
            var kids = $smileyRow.children().length;
            if(kids%smileisPerRow == 0) {
                $smileyRow = $("<div>").addClass("row gap-bottom text-center");
                $smileySet = $smileySet.add($smileyRow);
            }

            var smileyCol = $("<div>").addClass("col-md-2"),
                smileyImg = $("<img>").attr({
                    "src": "img/"+smiliesMap[i]+".gif",
                    "title": i.toString(),
                }).addClass("smiley-hint");
            smileyCol.append(smileyImg);
            $smileyRow.append(smileyCol);
        }

        $smileyGrid.append($smileySet);
        
    }
}
$(document).on('click', 'ul.list li', function () {

    let text = $(this).find('.name').text();
    let status = $(this).find('.status').text();
    let image = $(this).find('img').attr('src');
    const _this = $(this);
    const id = _this.attr('attr-user-id');
    const userName = _this.attr('attr-user-userName');
    const picture = _this.attr('attr-user-picture');
    const name = _this.attr('attr-user-name');
    const role = _this.attr('attr-user-role');

    targetUser = {
        id,
        name,
        userName,
        picture,
        status, role
    };
    $('.chat .sub-list .name').text('').text(text);
    $('.chat .sub-list .status').text('').text(status);
    $('.chat .sub-list img').prop("src", '').prop("src", image);
    $('.chat .message-container .received img').prop("src", image);

    if (targetUser.role === "0") {
        getAllChats();
    } else {
        getAllGroupChats();
    }


});
/**
 * get all the chat between users
 */
const getAllChats = () => {
    const token = sessionStorage.getItem('Authorization');
    httpCalls({
        method: 'GET',
        url: `/chats/?users=${currentUser._id}|${targetUser.id}`,
        headers: {
            "content-type": "application/json",
            'Authorization': token
        }
    }, (info) => {
        if (info.success) {
            updateChats(info.data);
        }

    })

};
/**
 * update chat appends the chat in proper format
 * @param chats
 */
const updateChats = (chats = []) => {
    $('.message-container').html('');
    jQuery.each(chats, function (i, chatItem) {
        if (currentUser._id === chatItem.senderid) {
            if (chatItem.file) {
                getAllFiles(chatItem.file);
            }
            $('.message-container').append(` <div class="sent">
                <ul>
                    <li class="sub-list-data">
                        <div class="msg-left"><p>${chatItem.message}</p></div>
                        <img src="./assets/${currentUser.picture}" alt=""/>
                    </li>
                </ul>
            </div>`);
        } else {
            if (chatItem.file) {
                getAllFilesRecieved(chatItem.file);
            }
            $('.message-container').append(` <div class="received">
                <ul>
                    <li class="sub-list-data">
                     <img src="./assets/${targetUser.picture}" alt=""/>
                        <div class="msg-right"><p>${chatItem.message}</p></div>   
                    </li>
                </ul>
            </div>`);
        }
    });
};
$(document).on('click', '.file', function () {
    console.log('hello');
    var id = $(this).attr('id');
    window.open(`http://localhost:8000/assets/${id}`);
});
const getAllFiles = (file) => {
    let ext = file.split('.').pop();
    if (ext === 'pdf') {
        $('.message-container').append(` <div class="sent">
        <ul>
        <li class="sub-list-data">
            <div class="msg-left-file"> <img id='${file}' class="file" src="./assets/PDF.png" alt=""/></div>
            <img src="./assets/${currentUser.picture}" alt=""/>
        </li>
    </ul>
    </div>`);
    } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        $('.message-container').append(` <div class="sent">
        <ul>
        <li class="sub-list-data">
            <div class="msg-left-file"><img id='${file}' class="file" src="./assets/${file}" alt=""/></div>
            <img src="./assets/${currentUser.picture}" alt=""/>
        </li>
    </ul>
    </div>`);
    }
    else if (ext === 'mp4' || ext === 'mov' || ext ==='gif') {
        $('.message-container').append(` <div class="sent">
        <ul>
        <li class="sub-list-data">
            <div class="msg-left-file"> <video id='${file}' class="file" src="./assets/${file}" alt=""/></div>
            <img src="./assets/${currentUser.picture}" alt=""/>
        </li>
    </ul>
    </div>`);
    }
}
const getAllFilesRecieved = (file) => {
    let ext = file.split('.').pop();
    if (ext === 'pdf') {
        $('.message-container').append(` <div class="received">
        <ul>
        <li class="sub-list-data">
            <img src="./assets/${targetUser.picture}" alt=""/>
            <div class="msg-right-file"> <img id='${file}' class="file" src="./assets/PDF.png" alt=""/></div>
        </li>
    </ul>
    </div>`);
    } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        $('.message-container').append(` <div class="received">
        <ul>
        <li class="sub-list-data">
            <img src="./assets/${targetUser.picture}" alt=""/>
            <div class="msg-right-file"><img id='${file}' class="file" src="./assets/${file}" alt=""/></div>
           
        </li>
    </ul>
    </div>`);
    }
    else if (ext === 'mp4' || ext === 'mov'|| ext ==='gif') {
        $('.message-container').append(` <div class="received">
        <ul>
        <li class="sub-list-data">
        <img src="./assets/${targetUser.picture}" alt=""/>
            <div class="msg-right-file"> <video id='${file}' class="file" src="./assets/${file}" alt=""/></div>
            
        </li>
    </ul>
    </div>`);
    }
}
/**
 * updateCurrentChat appends the msg sent after load
 * @param message
 * @param sender
 * @param receiver
 */
const updateCurrentChat = (data) => {
    if (data.file) {
        getAllFiles(data.file);
    }
    if (currentUser._id === data.senderid) {
        $('.message-container').append(` <div class="sent">
                <ul>
                    <li class="sub-list-data">
                        <div class="msg-left"><p>${data.message}</p></div>
                        <img src="./assets/${currentUser.picture}" alt=""/>
                    </li>
                </ul>
            </div>`);
    }
};
const updateRecieverChat = (data) => {
    if(data.file){
        getAllFilesRecieved(data.file);
    }
    console.log(data, currentUser._id)
    if (currentUser._id === data.receiverid) {
        console.log('data,currentUser._id')
        $('.message-container').append(` <div class="received">
                <ul>
                    <li class="sub-list-data">
                     <img src="./assets/${targetUser.picture}" alt=""/>
                        <div class="msg-right"><p>${data.message}</p></div>   
                    </li>
                </ul>
            </div>`);
    }
};
/**
 * Send message on enter
 * uses socket.io
 * @param event
 * @returns {boolean}
 */
function sendMessage(event) {
    const senderid = currentUser._id;
    const receiverid = targetUser.id;
    $('.list-container p').html(" ");
    let data;
    let file = $('#room-file')[0].files[0];
    const token = sessionStorage.getItem('Authorization');
    const message = $('#messageBox').val();
    console.log("file recieved from front end---", file);
    if (event.which === 13 || event.keyCode === 13) {
        const form = new FormData();
        form.append("message", message);
        form.append("file", file);
        form.append("senderid", senderid);
        form.append("receiverid", receiverid);
        if (targetUser.role === "1") {
            delete data.receiverid;
            data.roomId = targetUser.id;
        }
        
        httpCalls({
            method: 'POST',
            url: '/chats',
            data: form,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            headers: {
                'Authorization': token,
                // "content-type": "application/json",

            }
        }, (info) => {
            var obj = JSON.parse(info);
            updateCurrentChat(obj)
            console.log('response after post', obj)
        })
        $('#messageBox').val('');
        $('#room-file').val('');
        socket.emit('chat',
        {senderid,receiverid,message,file}
        );
        return false;
    } else {
        socket.emit('typing', {
            senderId: senderid,
            receiver: receiverid,
            sender: currentUser.username,
        });
        return true;
    }
};
/**
 * getUserName
 * gets the current user after page reload
 */
function getUserName() {
    const usr = sessionStorage.getItem('username');
    httpCalls({
        method: 'GET',
        url: '/users/data',

    }, (result) => {
        $.each(result.data, (i, item) => {
            if (item.username === usr) {
                currentUser = item;
                socket.emit('login', currentUser);
            }
        });
    });
    keyAuthenticate();
}
/**
 * onPage Reload
 */
$(() => {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
        getUserName();
    }
});
/**
 * to logout and empty session storage
 */
const logout = () => {
    socket.emit('disconnect');
    sessionStorage.clear();
    $('.home').fadeOut();
    $('.outerBoundary').fadeIn();
};
socket.on('chat', (data) => {
    console.log('....', data);
    $('.list-container p').html(" ");
    updateRecieverChat(data);
});
socket.on('typing', (data) => {
    $('.list-container p').html(`${data.sender} is typing.....`);
});
socket.on('onUserLogin', (data) => {
    $(`.list li[attr-user-id="${data._id}"]`).append(`<span class="dot"></span>`);
    /* $('.list li').each((i,item) => {
         if($(item).attr('attr-user-id') === data.userId) {
             <span>
             return;
         }
     })*/
});
socket.on('onlineUsers', (data) => {
    onPageLoad(data);
});
socket.on('onDisconnect', (data) => {
    $(`.list li[attr-user-id="${data}"] .dot`).remove();
});
/**
 * When the user clicks on div, open the popup
 */
function showPopup() {

    let popupWindow = $(`.popup .popuptext form p`);
    httpCalls({
        method: 'GET',
        url: '/users/data',

    }, (result) => {


        $.each(result.data, (i, item) => {
            if (item.username !== currentUser.username) {
                popupWindow.append(`<label><input type="checkbox" value = ${item.name}>${item.name}</label><br/>`);

            }

        });


    })
    var popup = document.getElementById("myPopup");
    $(popup).on('click', function (e) {
        e.stopPropagation();
    });
    popup.classList.toggle("show");
}
/**
 * saving group name and participants in DB
 * @param event
 */
const createRoom = (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem('Authorization');
    let groupname = $(`#room-name`).val();
    let picture = $('#room-image')[0].files[0];
    document.getElementById('myPopup').style.display = 'none';
    $("input:checkbox[type=checkbox]:checked").each(function () {
        participants.push($(this).val());
    });
    socket.emit('onGroupCreate', {

        groupName: groupname,
        picture,
        participants

    });
    const form = new FormData();
    form.append("participants[0]", currentUser.name);
    form.append("name", groupname);
    form.append("picture", picture);
    let x = 1;
    for (let i = 0; i < participants.length; i++) {
        form.append(`participants[${x}]`, participants[i]);
        x++;
    }

    httpCalls({
        method: 'POST',
        url: '/rooms',
        data: form,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        headers: {
            'Authorization': token
        }
    }, (info) => {
        /*   updateCurrentChat(message);*/
    })

};
const getAllGroups = () => {
    let status = false;
    let userData = $('ul.list');

    httpCalls({
        method: 'GET',
        url: '/rooms/data',

    }, (result) => {

        $.each(result.data, (i, item) => {
            status = false;
            $.each(item.participants, (i, members) => {
                if (members === currentUser.name) {
                    status = true;
                }
            });

            if (status) {
                userData.append(`<li class="sub-list"  attr-user-id="${item._id}" attr-user-name="${item.name}" attr-user-role=1 attr-user-picture="${item.picture}" >
                    <img src="./assets/${item.picture}" alt="avatar" /> <!--<span class="dot"></span>-->
                    <div class="sub-list-data">             
                    <div class="name">${item.name}</div>
                    <div class="status">${item.participants}</div>
                    </div>
                    </li>`);
            }

        });
    })

};
const getAllGroupChats = () => {

    const token = sessionStorage.getItem('Authorization');
    httpCalls({
        method: 'GET',
        url: `/chats/groupChat?users=${currentUser._id}|${targetUser.id}`,
        headers: {
            "content-type": "application/json",
            'Authorization': token
        }

    }, (info) => {
        if (info.success) {
            showAllGroupChats(info.data);
        }

    })

};
const showAllGroupChats = (chats) => {

    $('.message-container').html('');


    jQuery.each(chats, function (i, chatItem) {
        if (chatItem.roomId === targetUser.id) {
            if (currentUser._id === chatItem.senderid) {
                $('.message-container').append(` <div class="sent">
                <ul>

                    <li class="sub-list-data">
                        <div class="msg-left"><p>${chatItem.message}</p></div>
                        <img src="./assets/${currentUser.picture}" alt=""/>
                    </li>

                </ul>

            </div>`);

            } else {

                for (let i = 0; i < groupUser.length; i++) {
                    if (groupUser[i].id === chatItem.senderid) {

                        $('.message-container').append(` <div class="received">
                             <ul>

                                 <li class="sub-list-data">
                                    <img src="./assets/${groupUser[i].picture}" alt=""/>
                                    <div class="msg-right"><p>${chatItem.message}</p></div>   
                                 </li>

                              </ul>

                              </div>`);

                    }
                }

            }
        }
    })
}
