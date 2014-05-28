/**
 *@user Joseph
 */
// Saves options to localStorage.
function save_options() {
//    test_keys();
    localStorage["notify_on_start"] = $("input[name=notify_on_start]:checked").val();
    localStorage["first_notify"] = $("select[name=first_notify]").val();
    localStorage["notify_reg"] = $("input[name=notify_reg]:checked").val();
    localStorage["interval"] = $("input[name=interval]:checked").val();


    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "保存成功";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
    chrome.extension.sendRequest({method: "setLocalStorage",data:localStorage});

}

// Restores select box state to saved value from localStorage.
function restore_options() {
    $("input[name=notify_on_start][value="+localStorage["notify_on_start"]+"]").attr("checked",true);
    $("select[name=first_notify]").val(localStorage["first_notify"]);
    $("input[name=notify_reg][value="+localStorage["notify_reg"]+"]").attr("checked",true);
    $("input[name=interval][value="+localStorage["interval"]+"]").attr("checked",true);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
