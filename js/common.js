var config = {
  "this/is/an/event": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event1": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event2": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event3": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event4": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event5": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event6": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event7": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event8": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event9": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event10": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event11": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event12": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event13": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event14": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event15": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event16": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an1/event": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an2/event": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an3/event": {cost:10,command:"/say this is an event",enabled:true},
  "this/is/an/event2": {cost:20,command:"/say this is an event 2",enabled:true},
  "this/is/also/an/event": {cost:30,command:"/say this is also an event",enabled:true},
  "this/is/also/an/event2": {cost:40,command:"/say this is also an event 2",enabled:true},
  "this/is/again/an/event": {cost:30,command:"/say this is also an event",enabled:true},
  "hello/world": {cost:50,command:"/say hello world",enabled:true},
  "test1": {cost:50,command:"",enabled:true},
  "test2": {cost:50,command:"",enabled:false}
};

var domLoaded = false;
var clickWait = false;
var token = '';
var verificationServer = "https://sp-verification-server.herokuapp.com";

function populateMenu(){
  /*  Clear out menu  */
  document.getElementById('menu').innerHTML = "";
  /*  Try to add every event in config to menu  */
  for(const property in config){
    createEvent(property,config[property]);
  }
}

function createFolder(folderPath){

  /*  Get parent folder path  */
  var parentFolderPath = folderPath.split("/");
  parentFolderPath.pop();
  parentFolderPath = parentFolderPath.join("/");

  /*  Get Parent Folder Element */
  var parentFolder = getFolderElement(parentFolderPath);

  /*  Create new Folder Element */
  var newFolder = document.createElement('folder');
  newFolder.innerHTML = folderPath.split("/").pop();
  newFolder.id = folderPath;
  newFolder.className = "closed";
  /*  If folder is closed and clicked, open it
      If folder is open and clicked, close it */
  newFolder.onclick = (event) => {
    /*
      onclick is called when child elements are clicked too, so click wait
      makes sure that only the bottom level elements onclick is called
    */
    if(newFolder.className.includes("closed")){
      newFolder.className = newFolder.className.replace("closed","open");
    }else{
      newFolder.className = newFolder.className.replace("open","closed");
    }
    event.stopPropagation();
  };
  /*  Add new folder to parent folder */
  parentFolder.appendChild(newFolder);
  //if(parentFolder.id === 'menu') parentFolder.appendChild(document.createElement('br'));

  return newFolder;
}

function getFolderElement(folderPath){
  /*  If no folder is given, return root container  */
  if(!folderPath) return document.getElementById('menu');
  /*  Get folder  */
  var folder = document.getElementById(folderPath);
  /*  If folder does not exist, create it */
  if(!folder) folder = createFolder(folderPath);

  return folder;
}

function createEvent(eventPath,eventData){
  /*  Get the path to the events parent folder  */
  var parentPath = eventPath.split("/");
  parentPath.pop();
  parentPath = parentPath.join("/");

  /*  Get the element of the events parent folder */
  var parentElement = getFolderElement(parentPath);

  /*  Create a new event element and apply data */
  var eventElement = document.createElement('event');
  eventElement.innerHTML = eventPath.split("/").pop() + " ";
  eventElement.id = eventPath;
  eventElement.cost = eventData.cost;
  eventElement.command = eventData.command;
  eventElement.enabled = eventData.enabled;

  if(eventElement.enabled){
    eventElement.classList.add("enabled");
  } else {
    eventElement.classList.add("disabled");
  }

  /*  Also show event cost  */
  var costElement = document.createElement('cost');
  costElement.innerHTML = eventData.cost;
  //eventElement.appendChild(document.createElement('br'));
  eventElement.appendChild(costElement);

  eventElement.onclick = (event)=>{
    clickEventElement(eventElement);
    event.stopPropagation();
  };

  /*  Add event to parent folder  */
  parentElement.appendChild(eventElement);
  //if(parentElement.id === 'menu') parentElement.appendChild(document.createElement('br'));
}








window.addEventListener('DOMContentLoaded',()=>{
  domLoaded = true;
  populateMenu();
});

if(typeof window.Twitch !== 'undefined'){
  window.Twitch.ext.onAuthorized((auth)=>{
    console.log('Channel ID: ',auth.channelId);
    console.log('Client ID: ',auth.clientId);
    console.log('Token: ',auth.token);
    console.log('User ID: ',auth.userId);
    token = auth.token;
  });

  window.Twitch.ext.configuration.onChanged(()=>{
    console.log("Broadcaster config: ",window.Twitch.ext.configuration.broadcaster);
    console.log("Global config: ",window.Twitch.ext.configuration.global);
    console.log("Developer config: ",window.Twitch.ext.configuration.developer);

    config = JSON.parse(window.Twitch.ext.configuration.global.content);

    if(typeof window.Twitch.ext.configuration.broadcaster !== 'undefined'){
      config = JSON.parse(window.Twitch.ext.configuration.broadcaster.content);
    }

    if(domLoaded){
      populateMenu();
    }
  });

  window.Twitch.ext.listen("broadcast",function (target,contentType,message){
    try {
        message = JSON.parse(message);
    } catch (e) {
        // this accounts for JSON parse errors
        // just in case
        return;
    }

    console.log(message);

    // check that it's the exepected event
    if (message.event == 'configure') {
        try{
          console.log(message.data);
          config = JSON.parse(message.data);
          console.log("New config: ",config);
          if(domLoaded){
            populateMenu();
          }
        } catch(e){
          console.log(e);
          return;
        }
    }
  });
}
