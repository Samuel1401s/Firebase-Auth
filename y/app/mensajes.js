export { showmsg };

function showmsg(msg, type) {
Toastify({
            text: msg,
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "left", 
            stopOnFocus: true, 
            style: {
                background: type === 'bien' ? "green": "red"
            },
            onClick: function () { } 
        }).showToast();
    }