var therapyPlan = new Firebase('https://project4-75b45.firebaseio.com/');
 
function saveToList(event) {
    if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, we will attempt to save the data
        var planForm = document.getElementById('planForm').value.trim();
        if (planForm.length > 0) {
            saveToFB(planForm);
        }
        document.getElementById('planForm').value = '';
        return false;
    }
};
 
function saveToFB(planForm) {
    // this will save data to Firebase
    therapyPlan.push({
        name: planForm
    });
};
 
function refreshUI(list) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += '<li data-key="' + list[i].key + '">' + list[i].name + ' [' + genLinks(list[i].key, list[i].name) + ']</li>';
    };
    document.getElementById('therapyPlan').innerHTML = lis;
};
 
function genLinks(key, planName) {
    var links = '';
    links += '<a href="javascript:edit(\'' + key + '\',\'' + planName + '\')">Edit</a> | ';
    links += '<a href="javascript:del(\'' + key + '\',\'' + planName + '\')">Delete</a>';
    return links;
};
 
function edit(key, planName) {
    var planForm = prompt("Update the therapy plan?", planName); // to keep things simple and old skool :D
    if (planForm && planForm.length > 0) {
        // build the FB endpoint to the item in movies collection
        var updatePlan = buildEndPoint(key);
        updatePlan.update({
            name: planForm
        });
    }
}
 
function del(key, planName) {
    var response = confirm("Are certain about removing \"" + planName + "\" from the list?");
    if (response == true) {
        // build the FB endpoint to the item in movies collection
        var deletePlan = buildEndPoint(key);
        deletePlan.remove();
    }
}
 
function buildEndPoint (key) {
  return new Firebase('https://project4-75b45.firebaseio.com/' + key);
}
 
// this will get fired on inital load as well as when ever there is a change in the data
therapyPlan.on("value", function(snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            name = data[key].name ? data[key].name : '';
            if (name.trim().length > 0) {
                list.push({
                    name: name,
                    key: key
                });
            }
        }
    }
    // refresh the UI
    refreshUI(list);
});
