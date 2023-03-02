import './style.css';

// Type definitions for Kintone record events
// These are defined in the fields.d.ts file.
interface Event {
  appId: number;
  recordId: number;
  record: kintone.fieldTypes.CustomFields;
}

// Type definitions for our medium POST API data
interface MediumPostBody {
  title: string | null;
  contentFormat: string | null;
  content: string | null;
  tags: Array<string> | null;
  publishStatus: string | null;
  notifyFollowers: boolean | null;
}

interface DevToPostBody {
  article: object;
}

(function () {
  'use strict';
  kintone.events.on('app.record.detail.show', function (event: Event) {

    const postToMedium = async (postBody: MediumPostBody) => {

      const authorID = event.record.mediumAuthorID.value; // Our medium.com author ID
      const postUrl = `https://api.medium.com/v1/users/${authorID}/posts`; // The URL for our request
      const apiToken = event.record.mediumAPIKey.value; // Our medium.com "integration token"
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + apiToken
      }

      // We use kintone.proxy in order to get around CORS errors.
      // This sends a POST request to the medium.com API.
      // When we get a response we designate it as "response" and then log it to the console.
      kintone.proxy(postUrl, 'POST', headers, postBody).then(function (response) {
        //response[0] -> body(string)
        //response[1] -> status(number) 
        // 200 -> Success, 400 -> Error with your post body, 401 -> bad API token, 403 -> Wrong Author ID
        //response[2] -> headers(object)
        console.log(response[1]);
        console.log(JSON.parse(response[0]));
        console.log(response[2]);
      })
    };

    const postToDevto = async (postBody: DevToPostBody) => {

      const postUrl = "https://dev.to/api/articles"; // The URL for our request
      const apiToken = event.record.devtoAPIKey.value; // Our medium.com "integration token"
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': apiToken
      }

      console.log(postBody)

      // We use kintone.proxy in order to get around CORS errors.
      // This sends a POST request to the medium.com API.
      // When we get a response we designate it as "response" and then log it to the console.
      kintone.proxy(postUrl, 'POST', headers, postBody).then(function (response) {
        //response[0] -> body(string)
        //response[1] -> status(number) 
        // 200 -> Success, 400 -> Error with your post body, 401 -> bad API token, 403 -> Wrong Author ID
        //response[2] -> headers(object)
        console.log(response[1]);
        console.log(JSON.parse(response[0]));
        console.log(response[2]);
      })
    };

    // Medium API POST request's body
    const mediumBody: MediumPostBody = {
      title: event.record.title.value, // Article's title (from our Kintone record)
      contentFormat: 'markdown', // 'markdown' or 'html' (writing format)
      content: event.record.body.value, // Article's body (from our Kintone record)
      tags: event.record.tags.value, // String "tags" for our article. Optional!
      publishStatus: 'public', // The status of our article: 'public', 'draft', or 'unlisted'
      notifyFollowers: true // Sends a notification after publishing.  
    }

    // dev.to API POST request's body
    const devtoBody: DevToPostBody = {
      article: {
        title: event.record.title.value, // Article's title (from our Kintone record)
        published: true,
        body_markdown: event.record.body.value, // Article's body (from our Kintone record)
        tags: event.record.tags.value, // String "tags" for our article. Optional!
        series: "Test Series"
      }
    }

    // Create a button for Medium
    const mediumPublishButton: HTMLElement = document.createElement('button');
    //TODO
    mediumPublishButton.id = 'mediumPublishButton'; // Our "Element ID" from our Blank Space in the Kintone App.
    // Give it an id & class (for CSS), and text on the button.
    mediumPublishButton.className = '.uploadbutton';
    mediumPublishButton.innerHTML = 'Publish to Medium';

    // TODO
    // Run a function when the button is clicked
    mediumPublishButton.onclick = function () {
      // We need to call our API POST function with request's body... 🧐
      postToMedium(mediumBody);
    };


    // Set button on the Blank Space field
    kintone.app.record.getSpaceElement('mediumPublishButton')!.appendChild(mediumPublishButton);

    // Create a button for Medium
    const devtoPublishButton: HTMLElement = document.createElement('button');
    //TODO
    devtoPublishButton.id = 'devtoPublishButton'; // Our "Element ID" from our Blank Space in the Kintone App.
    // Give it an id & class (for CSS), and text on the button.
    devtoPublishButton.className = '.uploadbutton';
    devtoPublishButton.innerHTML = 'Publish to dev.to';

    // TODO
    // Run a function when the button is clicked
    devtoPublishButton.onclick = function () {
      // We need to call our API POST function with request's body... 🧐
      postToDevto(devtoBody);
    };
    // Set button on the Blank Space field
    kintone.app.record.getSpaceElement('devtoPublishButton')!.appendChild(devtoPublishButton);
  });
})();